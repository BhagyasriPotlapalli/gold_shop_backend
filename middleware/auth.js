import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

export const verifyToken = async (req, res, next) => {
    try {
        let token =
            req.headers["x-access-token"] ||
            req.headers["authorization"];

        if (!token) {
            return res.status(403).send({
                message: "No token provided!",
            });
        }

        if (token.startsWith("Bearer ")) {
            token = token.slice(7).trim();
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "secret-key"
        );

        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(401).send({
                message: "Unauthorized!",
            });
        }

        // Keep existing values
        req.userId = user.id;
        req.userRole = user.role;

        // Add complete authenticated user for audit logs
        req.user = {
            id: user.id,
            empId: user.empId,
            name: user.name,
            role: user.role,
        };

        next();
    } catch (error) {
        console.error("Verify Token Error:", error);

        return res.status(401).send({
            message: "Unauthorized!",
        });
    }
};

export const hasRole = (roles) => {
    return async (req, res, next) => {
        try {
            const user = await User.findByPk(req.userId);

            if (user && roles.includes(user.role)) {
                next();
                return;
            }

            res.status(403).send({
                message: `Require one of roles: ${roles.join(", ")}!`,
            });
        } catch (error) {
            res.status(500).send({
                message: error.message,
            });
        }
    };
};

export const isSuperAdmin = hasRole(["Super Admin"]);

export const isAdmin = hasRole(["Admin"]);

export const isStaff = hasRole(["Staff"]);

export const isManagement = hasRole([
    "Super Admin",
    "Admin",
]);