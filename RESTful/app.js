const express = require('express');
const bodyParser = require('express');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

const Post = mongoose.model('Post', {content: String, user: String});

app
    .route('/api/posts')
    .get( (req,res )=> {
    Post.find((err,response)=> {
        if(err){
            res.status(400).send();
        }
        res.send(response);
        
    });
})
    .post((req,res) => {
        console.log(req.body);

        let { content, user } = req.body;
    
        const post = new Post({content: content, user: user});

        post.save().then(response => {
            console.log(response);
            
            res.send(response);
            
        });
    })
    .delete((req, res)=> {
        Post.deleteMany().then(()=>{
            res.send();
        })
    })

    app.route('/api/post/:id')
    .get((req,res)=>{
        let id = req.params.id;

        Post.findById(id)
            .then(response=>{
            res.send(response);
        })
        .catch(err=>{
            res.status(400).send();
        });
    }).delete((req,res)=>{
        let id = req.params.id;
        Post.deleteOne({_id:id}).then(()=>{
            res.send();
        }).catch(err=>{
            res.status(400).send();
        });
    })
    .put((req,res)=> {
        let id = req.params.id;
        let { content } = req.body;
        Post.updateOne({_id: id}, { content: content }).then(updatedPost => {
            res.send();
        });
    });


    // 




app.listen(3000, () => {
    console.log('server is running on port 3000.');
    
});