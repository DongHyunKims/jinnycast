const express = require('express');
const router = express.Router();
const Album = require('../../database/model/album');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const multer = require("multer");
const User = require('../../database/model/user');




router.use(express.static('public'));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended : true}));

//const DEFAULT_IMG_URL = "http://localhost:3000";
//const DEFAULT_URL = "http://localhost:3000";

const DEFAULT_IMG_URL = "http://localhost:3000";

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'public/images/uploads/coverImg');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname+ '-' + Date.now() + "." +file.mimetype.split("/")[1])
    }
});

const upload = multer({ storage: storage });





// 자동화 라우팅
router.get("/insertAlbum",(req,res)=>{

    let album = new Album({
        title: "OST",
        coverImgUrl: "./default/coverImg.png",
        totalDuration: 4,
        category: [1,2,3],
        playList: [
            {
                title:  "[MV] HIGH4, IU(하이포, 아이유) _ Not Spring, Love, or Cherry Blossoms(봄,사랑,벚꽃 말고)",
                thumnail  : "https://i.ytimg.com/vi/ouR4nn1G9r4/default.jpg",
                duration : 1,
                videoId: "ouR4nn1G9r4",
                publishedAt: new Date("2014-04-08T03:00:00.000Z"),
            },
            {
                title:  "[MV] IU(아이유) _ Through the Night(밤편지)",
                thumnail  : "https://i.ytimg.com/vi/BzYnNdJhZQw/default.jpg",
                duration : 3,
                videoId: "BzYnNdJhZQw",
                publishedAt: new Date("2017-03-24T09:00:00.000Z"),
            }
        ]
    });

    album.save((err,doc)=>{
        if(err) return res.status(500).send(err);
        res.send(doc);
    });

});


function getAllAlbumJsonData(){
    return new Promise((resolve, reject)=>{
        fs.readFile(path.join(__dirname,"../../public/json/albumListData.json"), 'utf8',(err,data)=>{
            if(err) reject(err);
            let jsonData = JSON.parse(data);
            resolve(jsonData);
        });

    })
}

router.get("/insertAllAlbum",(req,res)=>{
    getAllAlbumJsonData().then((jsonData)=>{
        return jsonData.map((data)=>{
            return new Album(data);
        });
    }).catch((err)=>{
        console.log(err);
    }).then((jsonArr)=>{
        Album.insertMany(jsonArr,(err,doc)=>{
            if(err) return res.status(500).send(err);
            res.send(doc);
        });
    });

});

// 실제 사용 라우팅
// 전체 AlbumList 가져오는 라우터




router.get("/albums",(req,res)=>{
    let { _id }  = req.user;
    User.find({ _id : _id })
        .then((user)=>{
            if(!user.length) return res.status(404).send({ err: "User not found" });
            let albumIdList = user[0].albumList;
            return  Album.find({
                '_id': { $in: albumIdList}
            });
        })
        .catch((err)=>{
            if(err)  return res.status(500).send(err);
        })
        .then((albums)=>{
            if(!albums.length) return res.send({ err: "Albums not found" });
            res.json({jsonAlbumList:albums});
        }).catch((err)=>{
            if(err) return res.status(500).send(err);
        });

});



router.get("/albums/:albumId",(req,res)=>{
    let { albumId }   = req.params;
    Album.findOne({ _id: albumId },(err,album)=>{
        if(err)  return res.status(500).send(err);
        res.json(album);
    })
});


router.delete("/albums/:albumId",(req,res)=>{
    let { albumId }   = req.params;

    let { _id ,albumList}  = req.user;
    albumList.splice(albumList.indexOf(albumId),1);

    //let objectAlbumId = createObjectId(albumId);


    //console.log("_id",_id);

    Album.findByIdAndRemove(albumId).exec()
        .then((doc)=>{
            return User.findOne({ _id: _id}).exec();
        })
        .catch((err)=>{
            if(err) return res.status(500).send(err);
        })
        .then((user)=>{
            user.albumList = albumList;
            return user.save();
        })
        .catch((err)=>{
            if(err)  return res.status(500).send(err);
        })
        .then((doc)=>{
            res.json(doc);
        })
        .catch((err)=>{
            if(err)  return res.status(500).send(err);
        });

});



router.post("/albums",upload.single('coverImgUrl'),(req,res)=>{
    let { _id }  = req.user;


   //console.log("req.user",req.user);
    let {title,category} = req.body;
    // // 전송된 파일 데이터 확인

    let path = DEFAULT_IMG_URL+"/images/default/default-thumbnail.jpg";
    if(req.file) {
        path = req.file.path;
        path = DEFAULT_IMG_URL+ path.slice(path.indexOf("/"));
    }


    let album = new Album({
        title: title,
        coverImgUrl: path,
        totalDuration: 0,
        category: JSON.parse(category),
        playList: []
    });


    User.findOne({_id: _id}).exec()
        .then((user)=>{
            user.albumList.push(album._id);
            user.save();
        })
        .catch((err)=>{
            if(err) return res.status(500).send(err);
        })
        .then(()=>{
            album.save();
        })
        .catch((err)=>{
            if(err) return res.status(500).send(err);
        })
        .then((doc)=>{
            res.send(doc);
        })
        .catch((err)=>{
            if(err) return res.status(500).send(err);
        });




});




router.put("/albums/:albumId",upload.single('coverImgUrl'),(req,res)=>{
    let { albumId }   = req.params;
     console.log(albumId);
    let {title,category,coverImgUrl} = req.body;
    // // 전송된 파일 데이터 확인

    let path = coverImgUrl;
    if(req.file) {
        path = req.file.path;
        path = DEFAULT_IMG_URL+ path.slice(path.indexOf("/"));
    }


    Album.findOne({_id: albumId}).exec()
        .then((doc)=>{
            doc.title = title;
            doc.category = JSON.parse(category);
            doc.coverImgUrl = path;
            return  doc.save();
        })
        .catch((err)=>{
            if(err) return res.status(500).send(err);
        })
        .then((doc)=>{
            res.send(doc);
        })
        .catch((err)=>{
            if(err) return res.status(500).send(err);
        });




});




module.exports = router;
