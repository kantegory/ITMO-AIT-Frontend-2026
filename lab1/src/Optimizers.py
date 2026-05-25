import numpy as np
import time
from src.ConstructiveNumber import ConstructiveNumber


def _to_float_array(x):
    return np.array([float(xi) if isinstance(xi, ConstructiveNumber) else float(xi) for xi in x])


def _to_cn_array(x, epsilon):
    return [ConstructiveNumber(float(xi), epsilon=epsilon) for xi in x]


def gradient_descent(func_obj, x0, lr=0.01, max_iter=1000, tol=1e-8,
                     use_cn=False, cn_epsilon=None):
    history = {'x': [], 'f': [], 'grad_norm': [], 'epsilon': [], 'time': []}
    t0 = time.time()

    if use_cn and cn_epsilon is not None:
        x = _to_cn_array(x0, cn_epsilon)
    else:
        x = np.array(x0, dtype=float)

    for i in range(max_iter):
        f_val = func_obj.func(x)
        g = func_obj.grad(x)

        if use_cn:
            x_float = _to_float_array(x)
            f_float = float(f_val)
            g_float = _to_float_array(g)
            eps_vals = [xi.epsilon for xi in x]
            history['epsilon'].append(eps_vals)
        else:
            x_float = np.array(x, dtype=float)
            f_float = float(f_val)
            g_float = np.array(g, dtype=float)

        history['x'].append(x_float.copy())
        history['f'].append(f_float)
        history['grad_norm'].append(np.linalg.norm(g_float))
        history['time'].append(time.time() - t0)

        if np.linalg.norm(g_float) < tol:
            break

        if use_cn:
            x = [x[j] - lr * g[j] for j in range(len(x))]
        else:
            x = x - lr * g_float

    result_x = _to_float_array(x) if use_cn else x.copy()
    return result_x, history


def nelder_mead(func_obj, x0, max_iter=2000, tol=1e-10,
                use_cn=False, cn_epsilon=None,
                alpha=1.0, gamma=2.0, rho=0.5, sigma=0.5):
    n = len(x0)
    history = {'x': [], 'f': [], 'epsilon': [], 'time': []}
    t0 = time.time()

    def eval_f(point):
        if use_cn and cn_epsilon is not None:
            cn_point = _to_cn_array(point, cn_epsilon)
            result = func_obj.func(cn_point)
            f_eps = result.epsilon if isinstance(result, ConstructiveNumber) else 0.0
            return float(result), f_eps
        return float(func_obj.func(point)), 0.0

    simplex = [np.array(x0, dtype=float)]
    for i in range(n):
        point = np.array(x0, dtype=float)
        point[i] += 1.0
        simplex.append(point)

    f_values = []
    for s in simplex:
        fv, _ = eval_f(s)
        f_values.append(fv)

    for iteration in range(max_iter):
        order = np.argsort(f_values)
        simplex = [simplex[i] for i in order]
        f_values = [f_values[i] for i in order]

        best = simplex[0]
        f_best, f_eps = eval_f(best)
        history['x'].append(best.copy())
        history['f'].append(f_best)
        history['epsilon'].append(f_eps)
        history['time'].append(time.time() - t0)

        if np.std(f_values) < tol:
            break

        centroid = np.mean(simplex[:-1], axis=0)

        xr = centroid + alpha * (centroid - simplex[-1])
        fr, _ = eval_f(xr)

        if f_values[0] <= fr < f_values[-2]:
            simplex[-1] = xr
            f_values[-1] = fr
        elif fr < f_values[0]:
            xe = centroid + gamma * (xr - centroid)
            fe, _ = eval_f(xe)
            if fe < fr:
                simplex[-1] = xe
                f_values[-1] = fe
            else:
                simplex[-1] = xr
                f_values[-1] = fr
        else:
            xc = centroid + rho * (simplex[-1] - centroid)
            fc, _ = eval_f(xc)
            if fc < f_values[-1]:
                simplex[-1] = xc
                f_values[-1] = fc
            else:
                for i in range(1, len(simplex)):
                    simplex[i] = simplex[0] + sigma * (simplex[i] - simplex[0])
                    f_values[i], _ = eval_f(simplex[i])

    return simplex[0], history


def newton_method(func_obj, x0, max_iter=200, tol=1e-8,
                  use_cn=False, cn_epsilon=None):
    history = {'x': [], 'f': [], 'grad_norm': [], 'epsilon': [], 'time': []}
    t0 = time.time()

    if use_cn and cn_epsilon is not None:
        x = _to_cn_array(x0, cn_epsilon)
    else:
        x = np.array(x0, dtype=float)

    for i in range(max_iter):
        f_val = func_obj.func(x)
        g = func_obj.grad(x)
        H = func_obj.hess(x)

        if use_cn:
            x_float = _to_float_array(x)
            f_float = float(f_val)
            g_float = _to_float_array(g)
            eps_vals = [xi.epsilon for xi in x]
            history['epsilon'].append(eps_vals)
        else:
            x_float = np.array(x, dtype=float)
            f_float = float(f_val)
            g_float = np.array(g, dtype=float)

        history['x'].append(x_float.copy())
        history['f'].append(f_float)
        history['grad_norm'].append(np.linalg.norm(g_float))
        history['time'].append(time.time() - t0)

        if np.linalg.norm(g_float) < tol:
            break

        try:
            dx = -np.linalg.solve(H, g_float)
        except np.linalg.LinAlgError:
            H_reg = H + 1e-6 * np.eye(len(g_float))
            dx = -np.linalg.solve(H_reg, g_float)

        if use_cn:
            x = [x[j] + ConstructiveNumber(dx[j], dx[j]) for j in range(len(x))]
        else:
            x = x + dx

    result_x = _to_float_array(x) if use_cn else x.copy()
    return result_x, history
