// Role-based authorization middleware
const allowRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({ message: 'Not authorized, no role defined.' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: `Access denied. Requires one of: ${roles.join(', ')}` });
        }

        next();
    };
};

module.exports = { allowRoles };
