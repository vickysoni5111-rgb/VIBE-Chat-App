const socketIO = require("socket.io");

const socketInit = (server) => {
  const io = socketIO(server, {
    cors: { origin: "*" },
  });

  let users = [];

  io.on("connection", (socket) => {
    console.log("⚡ User Connected:", socket.id);

    // User online hone par map karein
    socket.on("addUser", (userId) => {
      if(!users.some(u => u.userId === userId)) {
        users.push({ userId, socketId: socket.id });
      }
      io.emit("getUsers", users);
    });

    // Private Message bhejna
    socket.on("sendMessage", ({ senderId, receiverId, text, type }) => {
      const user = users.find((u) => u.userId === receiverId);
      if (user) {
        io.to(user.socketId).emit("getMessage", { senderId, text, type });
      }
    });

    socket.on("disconnect", () => {
      users = users.filter((u) => u.socketId !== socket.id);
      io.emit("getUsers", users);
    });
  });
};

module.exports = socketInit;