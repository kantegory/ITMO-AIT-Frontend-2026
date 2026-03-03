const appData =[
    {
        id: 1, type: 'model', name: 'Llama-3-8B', task: 'nlp', framework: 'pytorch',
        license: 'mit', size: '15gb', downloads: '15K', stars: 120, forks: 45,
        metrics: 'LiveBench Global Average: 92%', desc: 'A powerful language model for text generation.',
        usage: 'pipeline("text-generation", model="llama-3-8b")'
    },
    {
        id: 2, type: 'model', name: 'ResNet-50', task: 'cv', framework: 'tensorflow',
        license: 'apache', size: '100mb', downloads: '45K', stars: 305, forks: 112,
        metrics: 'Imagenet Accuracy: 0.92', desc: 'Standard image classification model.',
        usage: 'model = tf.keras.applications.ResNet50()'
    },
    {
        id: 3, type: 'dataset', name: 'ImageNet-Mini', task: 'cv', framework: 'none',
        license: 'cc', size: '2gb', downloads: '8K', stars: 50, forks: 5,
        metrics: 'Images: 100k, Classes: 1000', desc: 'A smaller subset of ImageNet.',
        usage: 'dataset = load_dataset("imagenet-mini")'
    }
];