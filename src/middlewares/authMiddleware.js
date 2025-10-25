import jwt from 'jsonwebtoken';

export function verifyToken(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied, no token' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
}

export const verifyUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "No token, authorization denied" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Dynamic route validation — user must match
    if (req.params.user_id && req.params.user_id !== decoded.user_id)
      return res.status(403).json({ message: "Unauthorized access" });

    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT Error:", err);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

export const verifyVolunteer = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "No token, authorization denied" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (req.params.volunteer_id && req.params.volunteer_id !== decoded.user_id)
      return res.status(403).json({ message: "Unauthorized access" });

    if (decoded.role !== "VOLUNTEER")
      return res.status(403).json({ message: "Access restricted to volunteers" });

    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT Error:", err);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

export const verifyCoordinator = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "No token, authorization denied" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (req.params.coordinator_id && req.params.coordinator_id !== decoded.user_id)
      return res.status(403).json({ message: "Unauthorized access" });

    if (decoded.role !== "COORDINATOR")
      return res.status(403).json({ message: "Access restricted to coordinators" });

    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT Error:", err);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

export const verifyFaculty = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "No token, authorization denied" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (req.params.faculty_id && req.params.faculty_id !== decoded.user_id)
      return res.status(403).json({ message: "Unauthorized access" });

    if (decoded.role !== "FACULTY")
      return res.status(403).json({ message: "Access restricted to faculty" });

    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT Error:", err);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};