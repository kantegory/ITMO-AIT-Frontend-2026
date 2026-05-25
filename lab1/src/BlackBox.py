import numpy as np
from src.ConstructiveNumber import ConstructiveNumber


class BlackBox:

    def __init__(self):
        self._func_calls = 0
        self._grad_calls = 0
        self._hess_calls = 0

    @property
    def func_calls(self):
        return self._func_calls

    @property
    def grad_calls(self):
        return self._grad_calls

    @property
    def hess_calls(self):
        return self._hess_calls

    def reset_counters(self):
        self._func_calls = 0
        self._grad_calls = 0
        self._hess_calls = 0

    def func(self, x):
        raise NotImplementedError

    def grad(self, x):
        raise NotImplementedError

    def hess(self, x):
        raise NotImplementedError

    @property
    def dim(self):
        raise NotImplementedError

    @property
    def name(self):
        raise NotImplementedError

    @property
    def minimum(self):
        raise NotImplementedError


def _make_spd_matrix(eigenvalues, seed=42):
    n = len(eigenvalues)
    rng = np.random.RandomState(seed)
    Q, _ = np.linalg.qr(rng.randn(n, n))
    return Q @ np.diag(eigenvalues) @ Q.T


class QuadraticGoodCond(BlackBox):

    def __init__(self):
        super().__init__()
        eigenvalues = [1.0, 1.05, 1.1, 0.95, 1.02, 0.98]
        self.A = _make_spd_matrix(eigenvalues, seed=42)
        self.b_vec = np.array([1.0, -0.5, 0.3, -0.2, 0.1, -0.4])
        self.c = 5.0
        self._minimum = -np.linalg.solve(self.A, self.b_vec)
        self._cond = max(eigenvalues) / min(eigenvalues)

    @property
    def dim(self):
        return 6

    @property
    def name(self):
        return f"Квадратичная 6D (cond = {self._cond:.2f})"

    @property
    def minimum(self):
        return self._minimum

    def func(self, x):
        self._func_calls += 1
        if len(x) > 0 and isinstance(x[0], ConstructiveNumber):
            result = ConstructiveNumber(self.c, self.c)
            for i in range(self.dim):
                result = result + self.b_vec[i] * x[i]
                for j in range(self.dim):
                    result = result + 0.5 * self.A[i, j] * x[i] * x[j]
            return result
        x = np.asarray(x, dtype=float)
        return 0.5 * x @ self.A @ x + self.b_vec @ x + self.c

    def grad(self, x):
        self._grad_calls += 1
        if len(x) > 0 and isinstance(x[0], ConstructiveNumber):
            g = []
            for i in range(self.dim):
                gi = ConstructiveNumber(self.b_vec[i], self.b_vec[i])
                for j in range(self.dim):
                    gi = gi + self.A[i, j] * x[j]
                g.append(gi)
            return g
        x = np.asarray(x, dtype=float)
        return self.A @ x + self.b_vec

    def hess(self, x):
        self._hess_calls += 1
        return self.A.copy()


class QuadraticBadCond(BlackBox):

    def __init__(self):
        super().__init__()
        eigenvalues = [1.0, 10.0, 50.0, 100.0]
        self.A = _make_spd_matrix(eigenvalues, seed=123)
        self.b_vec = np.array([0.5, -1.0, 0.3, 0.7])
        self.c = 3.0
        self._minimum = -np.linalg.solve(self.A, self.b_vec)
        self._cond = max(eigenvalues) / min(eigenvalues)

    @property
    def dim(self):
        return 4

    @property
    def name(self):
        return f"Квадратичная 4D (cond = {self._cond:.0f})"

    @property
    def minimum(self):
        return self._minimum

    def func(self, x):
        self._func_calls += 1
        if len(x) > 0 and isinstance(x[0], ConstructiveNumber):
            result = ConstructiveNumber(self.c, self.c)
            for i in range(self.dim):
                result = result + self.b_vec[i] * x[i]
                for j in range(self.dim):
                    result = result + 0.5 * self.A[i, j] * x[i] * x[j]
            return result
        x = np.asarray(x, dtype=float)
        return 0.5 * x @ self.A @ x + self.b_vec @ x + self.c

    def grad(self, x):
        self._grad_calls += 1
        if len(x) > 0 and isinstance(x[0], ConstructiveNumber):
            g = []
            for i in range(self.dim):
                gi = ConstructiveNumber(self.b_vec[i], self.b_vec[i])
                for j in range(self.dim):
                    gi = gi + self.A[i, j] * x[j]
                g.append(gi)
            return g
        x = np.asarray(x, dtype=float)
        return self.A @ x + self.b_vec

    def hess(self, x):
        self._hess_calls += 1
        return self.A.copy()


class Rosenbrock(BlackBox):

    def __init__(self):
        super().__init__()

    @property
    def dim(self):
        return 3

    @property
    def name(self):
        return "Розенброк 3D"

    @property
    def minimum(self):
        return np.ones(3)

    def func(self, x):
        self._func_calls += 1
        if len(x) > 0 and isinstance(x[0], ConstructiveNumber):
            result = ConstructiveNumber(0.0, 0.0)
            for i in range(self.dim - 1):
                t1 = x[i + 1] - x[i] * x[i]
                t2 = 1.0 - x[i]
                result = result + 100.0 * t1 * t1 + t2 * t2
            return result
        x = np.asarray(x, dtype=float)
        result = 0.0
        for i in range(self.dim - 1):
            result += 100 * (x[i + 1] - x[i] ** 2) ** 2 + (1 - x[i]) ** 2
        return result

    def grad(self, x):
        self._grad_calls += 1
        if len(x) > 0 and isinstance(x[0], ConstructiveNumber):
            g = [ConstructiveNumber(0.0, 0.0) for _ in range(self.dim)]
            for i in range(self.dim - 1):
                t1 = x[i + 1] - x[i] * x[i]
                g[i] = g[i] + (-400.0) * x[i] * t1 + 2.0 * x[i] - 2.0
                g[i + 1] = g[i + 1] + 200.0 * t1
            return g
        x = np.asarray(x, dtype=float)
        g = np.zeros(self.dim)
        for i in range(self.dim - 1):
            g[i] += -400 * x[i] * (x[i + 1] - x[i] ** 2) + 2 * (x[i] - 1)
            g[i + 1] += 200 * (x[i + 1] - x[i] ** 2)
        return g

    def hess(self, x):
        self._hess_calls += 1
        xf = np.array([float(xi) if isinstance(xi, ConstructiveNumber) else float(xi) for xi in x])
        H = np.zeros((self.dim, self.dim))
        for i in range(self.dim - 1):
            H[i, i] += -400 * (xf[i + 1] - 3 * xf[i] ** 2) + 2
            H[i, i + 1] += -400 * xf[i]
            H[i + 1, i] += -400 * xf[i]
            H[i + 1, i + 1] += 200
        return H
