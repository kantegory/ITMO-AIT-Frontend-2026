class ConstructiveNumber:

    def __init__(self, a, b=None, *, epsilon=None):
        if b is not None and epsilon is None:
            self.a = float(a)
            self.b = float(b)
        elif epsilon is not None and b is None:
            x = float(a)
            eps = abs(float(epsilon))
            self.a = x - eps / 2
            self.b = x + eps / 2
        else:
            raise ValueError("Укажите либо (a, b), либо (x, epsilon=e)")
        if self.a > self.b:
            self.a, self.b = self.b, self.a

    @property
    def epsilon(self):
        return self.b - self.a

    def value(self, alpha=0.5):
        if not 0 <= alpha <= 1:
            raise ValueError("alpha должен быть в [0, 1]")
        return self.a * (1 - alpha) + self.b * alpha

    @staticmethod
    def _to_cn(other):
        if isinstance(other, ConstructiveNumber):
            return other
        if isinstance(other, (int, float)):
            v = float(other)
            return ConstructiveNumber(v, v)
        raise TypeError(f"Неподдерживаемый тип: {type(other)}")

    def __add__(self, other):
        o = self._to_cn(other)
        return ConstructiveNumber(self.a + o.a, self.b + o.b)

    def __radd__(self, other):
        return self.__add__(other)

    def __sub__(self, other):
        o = self._to_cn(other)
        return ConstructiveNumber(self.a - o.b, self.b - o.a)

    def __rsub__(self, other):
        o = self._to_cn(other)
        return ConstructiveNumber(o.a - self.b, o.b - self.a)

    def __mul__(self, other):
        o = self._to_cn(other)
        products = [self.a * o.a, self.a * o.b, self.b * o.a, self.b * o.b]
        return ConstructiveNumber(min(products), max(products))

    def __rmul__(self, other):
        return self.__mul__(other)

    def __truediv__(self, other):
        o = self._to_cn(other)
        if o.a <= 0 <= o.b:
            raise ZeroDivisionError("Деление на интервал, содержащий 0")
        inv = ConstructiveNumber(1.0 / o.b, 1.0 / o.a)
        return self * inv

    def __rtruediv__(self, other):
        o = self._to_cn(other)
        return o / self

    def __neg__(self):
        return ConstructiveNumber(-self.b, -self.a)

    def __pow__(self, n):
        if not isinstance(n, int) or n < 0:
            raise ValueError("Поддерживается только целая неотрицательная степень")
        if n == 0:
            return ConstructiveNumber(1.0, 1.0)
        if n == 2:
            if self.a >= 0:
                return ConstructiveNumber(self.a ** 2, self.b ** 2)
            elif self.b <= 0:
                return ConstructiveNumber(self.b ** 2, self.a ** 2)
            else:
                return ConstructiveNumber(0.0, max(self.a ** 2, self.b ** 2))
        result = ConstructiveNumber(1.0, 1.0)
        for _ in range(n):
            result = result * self
        return result

    def __eq__(self, other):
        o = self._to_cn(other)
        return self.a == o.a and self.b == o.b

    def __lt__(self, other):
        o = self._to_cn(other)
        return self.b < o.a

    def __le__(self, other):
        o = self._to_cn(other)
        return self.b <= o.a

    def __gt__(self, other):
        o = self._to_cn(other)
        return self.a > o.b

    def __ge__(self, other):
        o = self._to_cn(other)
        return self.a >= o.b

    def __str__(self):
        return f"[{self.a:.6f}, {self.b:.6f}]"

    def __repr__(self):
        return f"CN({self.a}, {self.b})"

    def __float__(self):
        return self.value(0.5)
