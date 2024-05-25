const express = require("express");
const app = express();
const cors = require("cors");
const dbConnect = require("./db/dbConnect");
const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");
// const CommentRouter = require("./routes/CommentRouter");
const middle = require("./middleware/middle");
const multer  = require('multer')
const auth = require("./middleware/middle");
const Photo = require("./db/photoModel");


dbConnect();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/Users/khanh/WebstormProjects/Photo_Sharing_2/src/images')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
const upload = multer({ storage })

app.use(cors());
app.use(express.json());
app.use("/api/user", UserRouter);
app.use("/api/photo", PhotoRouter);

app.get("/", (request, response) => {
  response.send({ message: "Hello from photo-sharing app API!" });
});

app.post('/api/photo/new', auth, upload.single('images'), async (req, res) => {
    const photo = new Photo({
        user_id: req.body.user_id,
        file_name: req.file.filename,
        date_time: new Date().toDateString()
    });
    photo.save().then(() => {
        res.status(200).send();
    }).catch((error) => {
        res.status(400).send({error: error});
    });

});

app.listen(8081, () => {
  console.log("server listening on port 8081");
});
