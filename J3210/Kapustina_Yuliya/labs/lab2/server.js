const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'fanfic-secret-key-2026';

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Настройка загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'pics/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Чтение данных
async function readData(filename) {
  try {
    const data = await fs.readFile(path.join(__dirname, 'data', filename), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { [filename.split('.')[0]]: [] };
  }
}

async function writeData(filename, data) {
  await fs.writeFile(
    path.join(__dirname, 'data', filename),
    JSON.stringify(data, null, 2),
    'utf8'
  );
}

// Middleware проверки токена
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Требуется авторизация' });
  }
  
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Недействительный токен' });
    }
    req.user = user;
    next();
  });
}

// Регистрация
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Валидация на сервере
    if (!username || username.length < 3) {
      return res.status(400).json({ error: 'Имя пользователя должно быть не менее 3 символов' });
    }
    
    if (!email || !email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ error: 'Введите корректный email' });
    }
    
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Пароль должен быть не менее 6 символов' });
    }
    
    const usersData = await readData('users.json');
    const users = usersData.users;
    
    // Проверка уникальности
    if (users.find(u => u.username === username)) {
      return res.status(400).json({ error: 'Имя пользователя уже занято' });
    }
    
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'Email уже используется' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = {
      id: users.length + 1,
      username,
      email,
      password: hashedPassword,
      bio: '',
      avatar: 'default-avatar.png',
      createdAt: new Date().toISOString(),
      likes: [],
      history: []
    };
    
    users.push(newUser);
    await writeData('users.json', { users });
    
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username },
      SECRET_KEY,
      { expiresIn: '7d' }
    );
    
    res.json({
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        bio: newUser.bio,
        avatar: newUser.avatar
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Вход
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Заполните все поля' });
    }
    
    const usersData = await readData('users.json');
    // Ищем пользователя по username ИЛИ по email
    const user = usersData.users.find(u => 
      u.username === username || u.email === username
    );
    
    if (!user) {
      return res.status(401).json({ error: 'Неверное имя пользователя или пароль' });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Неверное имя пользователя или пароль' });
    }
    
    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: '7d' }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Получение профиля
// Получение профиля
app.get('/api/profile/:username', async (req, res) => {
  try {
    const usersData = await readData('users.json');
    const user = usersData.users.find(u => u.username === req.params.username);
    
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    
    const ficsData = await readData('fics.json');
    
    // Получаем токен из заголовка, чтобы проверить, кто запрашивает
    const token = req.headers.authorization?.split(' ')[1];
    let isOwner = false;
    let currentUserId = null;
    
    if (token) {
      try {
        const decoded = jwt.verify(token, SECRET_KEY);
        currentUserId = decoded.id;
        isOwner = currentUserId === user.id;
      } catch (err) {}
    }
    
    // Если это владелец профиля - показываем все его фанфики (включая черновики)
    // Если нет - показываем только опубликованные
    let userFics;
    if (isOwner) {
      userFics = ficsData.fics.filter(f => f.authorId === user.id);
    } else {
      userFics = ficsData.fics.filter(f => 
        f.authorId === user.id && f.status !== 'draft'
      );
    }
    
    // Получаем количество подписчиков (инициализируем, если нет)
    const subscribersCount = user.subscribers ? user.subscribers.length : 0;
    
    const stats = {
      ficsCount: userFics.length,
      totalViews: userFics.reduce((sum, fic) => sum + fic.views, 0),
      totalLikes: userFics.reduce((sum, fic) => sum + fic.likes, 0),
      subscribers: subscribersCount  // ← ИСПРАВЛЕНО: теперь берем реальное количество
    };
    
    res.json({
      user: {
        id: user.id,
        username: user.username,
        bio: user.bio,
        avatar: user.avatar,
        createdAt: user.createdAt
      },
      stats,
      fics: userFics
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Обновление профиля
app.put('/api/profile', authenticateToken, upload.single('avatar'), async (req, res) => {
  try {
    const { username, bio } = req.body;
    const avatarFile = req.file;
    
    // Проверка файла аватара
    if (avatarFile) {
      // Проверяем тип файла
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(avatarFile.mimetype)) {
        // Удаляем загруженный файл
        fsSync.unlinkSync(avatarFile.path);
        return res.status(400).json({ error: 'Можно загружать только изображения (JPEG, PNG, GIF, WEBP)' });
      }
      
      // Проверяем размер файла (максимум 5 МБ)
      const maxSize = 5 * 1024 * 1024; // 5 MB
      if (avatarFile.size > maxSize) {
        fsSync.unlinkSync(avatarFile.path);
        return res.status(400).json({ error: 'Размер файла не должен превышать 5 МБ' });
      }
    }
    
    const usersData = await readData('users.json');
    const userIndex = usersData.users.findIndex(u => u.id === req.user.id);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    
    if (username) usersData.users[userIndex].username = username;
    if (bio !== undefined) usersData.users[userIndex].bio = bio;
    if (avatarFile) {
      // Удаляем старый аватар, если он не стандартный
      const oldAvatar = usersData.users[userIndex].avatar;
      if (oldAvatar && oldAvatar !== 'default-avatar.png') {
        const oldAvatarPath = path.join(__dirname, 'public/pics', oldAvatar);
        if (fsSync.existsSync(oldAvatarPath)) {
          fsSync.unlinkSync(oldAvatarPath);
        }
      }
      usersData.users[userIndex].avatar = avatarFile.filename;
    }
    
    await writeData('users.json', usersData);
    
    res.json({
      user: {
        id: usersData.users[userIndex].id,
        username: usersData.users[userIndex].username,
        bio: usersData.users[userIndex].bio,
        avatar: usersData.users[userIndex].avatar
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});


const fsSync = require('fs');
if (!fsSync.existsSync('public/pics')) {
  fsSync.mkdirSync('public/pics', { recursive: true });
}

if (!fsSync.existsSync('data')) {
  fsSync.mkdirSync('data', { recursive: true });
  
  fsSync.writeFileSync('data/users.json', JSON.stringify({ users: [] }, null, 2));
  fsSync.writeFileSync('data/fics.json', JSON.stringify({ fics: [] }, null, 2));
  fsSync.writeFileSync('data/comments.json', JSON.stringify({ comments: [] }, null, 2));
}

// Получение всех опубликованных фанфиков (для главной и поиска)
app.get('/api/fics', async (req, res) => {
  try {
    const ficsData = await readData('fics.json');
    // Возвращаем только опубликованные (in_progress и completed)
    const publishedFics = ficsData.fics.filter(f => 
      f.status === 'published' || f.status === 'in_progress' || f.status === 'completed'
    );
    res.json(publishedFics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Получение фанфиков пользователя (включая черновики)
app.get('/api/user/fics', authenticateToken, async (req, res) => {
  try {
    const ficsData = await readData('fics.json');
    const userFics = ficsData.fics.filter(f => f.authorId === req.user.id);
    res.json(userFics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Получение одного фанфика по ID
app.get('/api/fics/:id', async (req, res) => {
  try {
    const ficId = parseInt(req.params.id);
    const ficsData = await readData('fics.json');
    const fic = ficsData.fics.find(f => f.id === ficId);
    
    if (!fic) {
      return res.status(404).json({ error: 'Фанфик не найден' });
    }
    
    // Проверка: если фанфик черновик, то только автор может его видеть
    const token = req.headers.authorization?.split(' ')[1];
    let isAuthor = false;
    
    if (token) {
      try {
        const decoded = jwt.verify(token, SECRET_KEY);
        isAuthor = decoded.id === fic.authorId;
      } catch (err) {}
    }
    
    if (fic.status === 'draft' && !isAuthor) {
      return res.status(404).json({ error: 'Фанфик не найден' });
    }
    
    // Увеличиваем просмотры только для опубликованных
    if (fic.status !== 'draft') {
      fic.views += 1;
      await writeData('fics.json', ficsData);
    }
    
    // Получаем комментарии
    const commentsData = await readData('comments.json');
    const comments = commentsData.comments.filter(c => c.ficId === ficId);
    
    res.json({ fic, comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Создание фанфика
app.post('/api/fics', authenticateToken, async (req, res) => {
  try {
    const { title, fandom, description, rating, content, tags, status } = req.body;
    
    // Валидация
    if (!title || title.length < 3) {
      return res.status(400).json({ error: 'Название должно быть не менее 3 символов' });
    }
    
    if (!fandom) {
      return res.status(400).json({ error: 'Выберите фандом' });
    }
    
    if (!description || description.length < 10) {
      return res.status(400).json({ error: 'Описание должно быть не менее 10 символов' });
    }
    
    if (!content) {
      return res.status(400).json({ error: 'Введите текст фанфика' });
    }
    
    if (!tags || tags.length === 0) {
      return res.status(400).json({ error: 'Добавьте хотя бы один тег' });
    }
    
    const ficsData = await readData('fics.json');
    
    const newFic = {
      id: ficsData.fics.length + 1,
      title,
      authorId: req.user.id,
      authorName: req.user.username,
      rating,
      fandom,
      tags: tags,
      description,
      content,
      views: 0,
      likes: 0,
      commentsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: status === 'draft' ? 'draft' : (status === 'completed' ? 'completed' : 'in_progress')
    };
    
    ficsData.fics.push(newFic);
    await writeData('fics.json', ficsData);
    
    res.json(newFic);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Обновление статуса фанфика
app.patch('/api/fics/:id/status', authenticateToken, async (req, res) => {
  try {
    const ficId = parseInt(req.params.id);
    const { status } = req.body;
    
    if (!['in_progress', 'completed', 'draft'].includes(status)) {
      return res.status(400).json({ error: 'Неверный статус' });
    }
    
    const ficsData = await readData('fics.json');
    const ficIndex = ficsData.fics.findIndex(f => f.id === ficId);
    
    if (ficIndex === -1) {
      return res.status(404).json({ error: 'Фанфик не найден' });
    }
    
    if (ficsData.fics[ficIndex].authorId !== req.user.id) {
      return res.status(403).json({ error: 'Нет прав' });
    }
    
    ficsData.fics[ficIndex].status = status;
    ficsData.fics[ficIndex].updatedAt = new Date().toISOString();
    await writeData('fics.json', ficsData);
    
    res.json({ success: true, status });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Обновление фанфика (редактирование)
app.put('/api/fics/:id', authenticateToken, async (req, res) => {
  try {
    const ficId = parseInt(req.params.id);
    const { title, fandom, description, rating, content, tags, status } = req.body;
    
    const ficsData = await readData('fics.json');
    const ficIndex = ficsData.fics.findIndex(f => f.id === ficId);
    
    if (ficIndex === -1) {
      return res.status(404).json({ error: 'Фанфик не найден' });
    }
    
    // Проверяем, что пользователь - автор
    if (ficsData.fics[ficIndex].authorId !== req.user.id) {
      return res.status(403).json({ error: 'Нет прав на редактирование' });
    }
    
    // Валидация
    if (!title || title.length < 3) {
      return res.status(400).json({ error: 'Название должно быть не менее 3 символов' });
    }
    
    if (!fandom) {
      return res.status(400).json({ error: 'Выберите фандом' });
    }
    
    if (!description || description.length < 10) {
      return res.status(400).json({ error: 'Описание должно быть не менее 10 символов' });
    }
    
    if (!content) {
      return res.status(400).json({ error: 'Введите текст фанфика' });
    }
    
    if (!tags || tags.length === 0) {
      return res.status(400).json({ error: 'Добавьте хотя бы один тег' });
    }
    
    // Обновляем фанфик
    ficsData.fics[ficIndex] = {
      ...ficsData.fics[ficIndex],
      title,
      fandom,
      description,
      rating,
      content,
      tags,
      status: status || ficsData.fics[ficIndex].status,
      updatedAt: new Date().toISOString()
    };
    
    await writeData('fics.json', ficsData);
    
    console.log(`Фанфик ${ficId} обновлен пользователем ${req.user.username}`);
    res.json(ficsData.fics[ficIndex]);
    
  } catch (error) {
    console.error('Ошибка при обновлении фанфика:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Лайк/дизлайк фанфика
app.post('/api/fics/:id/like', authenticateToken, async (req, res) => {
  try {
    const ficId = parseInt(req.params.id);
    const userId = req.user.id;
    
    const usersData = await readData('users.json');
    const userIndex = usersData.users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    
    const ficsData = await readData('fics.json');
    const fic = ficsData.fics.find(f => f.id === ficId);
    
    if (!fic) {
      return res.status(404).json({ error: 'Фанфик не найден' });
    }
    
    // Инициализируем likes и history если их нет
    if (!usersData.users[userIndex].likes) {
      usersData.users[userIndex].likes = [];
    }
    
    // Проверяем, лайкнул ли пользователь уже этот фанфик
    const hasLiked = usersData.users[userIndex].likes.includes(ficId);
    
    if (hasLiked) {
      // Убираем лайк
      usersData.users[userIndex].likes = usersData.users[userIndex].likes.filter(id => id !== ficId);
      fic.likes -= 1;
    } else {
      // Добавляем лайк
      usersData.users[userIndex].likes.push(ficId);
      fic.likes += 1;
    }
    
    await writeData('users.json', usersData);
    await writeData('fics.json', ficsData);
    
    res.json({ 
      likes: fic.likes, 
      liked: !hasLiked 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Получение избранных фанфиков пользователя
app.get('/api/user/likes', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const usersData = await readData('users.json');
    const user = usersData.users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    
    const ficsData = await readData('fics.json');
    
    const likedFicIds = user.likes || [];
    const likedFics = ficsData.fics.filter(f => 
      likedFicIds.includes(f.id) && f.status !== 'draft'
    );
    
    res.json(likedFics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Добавление в историю просмотров
app.post('/api/history', authenticateToken, async (req, res) => {
  try {
    const { ficId } = req.body;
    const userId = req.user.id;
    
    const usersData = await readData('users.json');
    const userIndex = usersData.users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    
    // Инициализируем history если нет
    if (!usersData.users[userIndex].history) {
      usersData.users[userIndex].history = [];
    }
    
    // Удаляем старую запись, если она есть
    usersData.users[userIndex].history = usersData.users[userIndex].history.filter(h => h.ficId !== ficId);
    
    // Добавляем новую запись в начало
    usersData.users[userIndex].history.unshift({
      ficId: ficId,
      viewedAt: new Date().toISOString()
    });
    
    // Ограничиваем историю последними 50 записями
    if (usersData.users[userIndex].history.length > 50) {
      usersData.users[userIndex].history = usersData.users[userIndex].history.slice(0, 50);
    }
    
    await writeData('users.json', usersData);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Получение истории просмотров пользователя
app.get('/api/user/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const usersData = await readData('users.json');
    const user = usersData.users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    
    const ficsData = await readData('fics.json');
    
    const userHistory = user.history || [];
    const historyFics = userHistory.map(h => {
      const fic = ficsData.fics.find(f => f.id === h.ficId);
      if (fic && fic.status !== 'draft') {
        return { ...fic, viewedAt: h.viewedAt };
      }
      return null;
    }).filter(f => f !== null);
    
    res.json(historyFics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});
// Получение подписок пользователя
app.get('/api/user/subscriptions', authenticateToken, async (req, res) => {
  try {
    const usersData = await readData('users.json');
    const user = usersData.users.find(u => u.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    
    res.json(user.subscriptions || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Подписка/отписка на пользователя
app.post('/api/user/subscribe/:username', authenticateToken, async (req, res) => {
  try {
    const targetUsername = req.params.username;
    const userId = req.user.id;
    const currentUsername = req.user.username;
    
    console.log('Подписка:', currentUsername, 'на', targetUsername); // Отладка
    
    const usersData = await readData('users.json');
    const currentUserIndex = usersData.users.findIndex(u => u.id === userId);
    const targetUserIndex = usersData.users.findIndex(u => u.username === targetUsername);
    
    if (currentUserIndex === -1 || targetUserIndex === -1) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    
    // Инициализируем subscriptions и subscribers если нет
    if (!usersData.users[currentUserIndex].subscriptions) {
      usersData.users[currentUserIndex].subscriptions = [];
    }
    if (!usersData.users[targetUserIndex].subscribers) {
      usersData.users[targetUserIndex].subscribers = [];
    }
    
    const isSubscribed = usersData.users[currentUserIndex].subscriptions.includes(targetUsername);
    
    if (isSubscribed) {
      // Отписываемся
      usersData.users[currentUserIndex].subscriptions = usersData.users[currentUserIndex].subscriptions.filter(s => s !== targetUsername);
      usersData.users[targetUserIndex].subscribers = usersData.users[targetUserIndex].subscribers.filter(s => s !== currentUsername);
      console.log('Отписались');
    } else {
      // Подписываемся
      usersData.users[currentUserIndex].subscriptions.push(targetUsername);
      usersData.users[targetUserIndex].subscribers.push(currentUsername);
      console.log('Подписались');
    }
    
    await writeData('users.json', usersData);
    
    res.json({ 
      subscribed: !isSubscribed,
      subscribersCount: usersData.users[targetUserIndex].subscribers.length
    });
  } catch (error) {
    console.error('Ошибка подписки:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});
// Добавление комментария
app.post('/api/fics/:id/comments', authenticateToken, async (req, res) => {
  try {
    const ficId = parseInt(req.params.id);
    const { content } = req.body;
    
    console.log('Добавление комментария к фанфику:', ficId);
    console.log('Текст:', content);
    
    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'Введите текст комментария' });
    }
    
    const commentsData = await readData('comments.json');
    
    const newComment = {
      id: commentsData.comments.length + 1,
      ficId,
      userId: req.user.id,
      username: req.user.username,
      content: content.trim(),
      createdAt: new Date().toISOString()
    };
    
    commentsData.comments.push(newComment);
    await writeData('comments.json', commentsData);
    
    // Обновляем количество комментариев в фанфике
    const ficsData = await readData('fics.json');
    const fic = ficsData.fics.find(f => f.id === ficId);
    if (fic) {
      fic.commentsCount = commentsData.comments.filter(c => c.ficId === ficId).length;
      await writeData('fics.json', ficsData);
    }
    
    console.log('Комментарий добавлен:', newComment);
    res.json(newComment);
  } catch (error) {
    console.error('Ошибка добавления комментария:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});