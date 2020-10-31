const container = document.querySelector('.dynamicDiv');

function init() {
    const p = document.createElement('p');
    p.innerHTML = 'profile';
    p.classList.add('pageTag');
    container.appendChild(p);

    //-----------------------------------------------------------------------------------------------------
    function profileBar(accountName, source) {
        const profBar = document.createElement('div');
        const img = document.createElement('img');
        const username = document.createElement('p');

        img.src = 'uploads/' + source;
        console.log(img.src);
        console.log(source);
        username.innerHTML = accountName;
        img.classList.add('image');
        username.classList.add('username');
        profBar.appendChild(img);
        profBar.appendChild(username);
        profBar.classList.add('infoWrapper');
        container.appendChild(profBar);
        //open image
        img.addEventListener('click', () => {


            const modalDiv = document.createElement('div');
            const childImg = document.createElement('img');
            const close = document.createElement('div');
            modalDiv.classList.add('modalDiv');
            childImg.classList.add('childImg');
            close.classList.add('close');
            childImg.src = 'uploads/' + source;

            modalDiv.appendChild(close);
            modalDiv.appendChild(childImg);
            container.appendChild(modalDiv);

            // close modal
            close.addEventListener('click', () => {
                modalDiv.style.visibility = 'hidden';
            });
        });
    }

    fetch('http://localhost:3000/user/data')
        .then(res => {
            return res.json();
        }).then(user => {

            profileBar(user.username, user.myImage);

            // posts container
            const wrapper = document.createElement('div');
            const div1 = document.createElement('div');
            const div2 = document.createElement('div');

            wrapper.classList.add('wrapper');
            div1.classList.add('div1');
            div2.classList.add('div2');
            wrapper.appendChild(div1);
            wrapper.appendChild(div2);
            container.appendChild(wrapper);

            // Writing posts
            const textArea = document.createElement('textarea');
            const p2 = document.createElement('p');
            p2.innerHTML = 'Write post';
            p2.classList.add('writePost');
            textArea.classList.add('textArea');
            div1.appendChild(p2);
            div1.appendChild(textArea);
            // Sending posts
            const sendBtn = document.createElement('button');
            sendBtn.innerHTML = 'Send Post';
            sendBtn.classList.add('sendBtn');
            div1.appendChild(sendBtn);

            sendBtn.addEventListener('click', () => {
                if (textArea.value == '') {
                    console.log('please enter text');
                    const fail = document.createElement('p');
                    fail.innerHTML = 'please enter text';
                    fail.classList.add('failure');
                    div1.insertBefore(fail, textArea);
                    setTimeout(() => fail.remove(), 2000);
                } else {
                    console.log(textArea.value);
                    const success = document.createElement('p');
                    success.innerHTML = 'post is sent';
                    success.classList.add('success');
                    div1.insertBefore(success, textArea);
                    setTimeout(() => success.remove(), 2000);

                    const myPost = {
                        text: textArea.value
                    }
                    const config = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(myPost)
                    }
                    fetch('http://localhost:3000/user/posts', config)
                        .then(result => {
                            return result.json();
                        }).then(data => {
                            // console.log(data.posts.text);
                            div2.innerHTML = null;
                            const h1 = document.createElement('h1');
                            h1.innerHTML = 'My posts';
                            h1.classList.add('noPosts');
                            div2.appendChild(h1);
                            const inOrder = data.posts.reverse();
                            inOrder.forEach(post => {
                                populatePost(user.username, post, user.myImage);
                            });
                        }).catch(err => console.log(err));
                    textArea.value = '';
                }
            });
            if (user.posts.length <= 0) {
                console.log('No posts sofar');
                const h1 = document.createElement('h1');
                h1.innerHTML = 'No posts sofar';
                h1.classList.add('noPosts');
                div2.appendChild(h1);
            } else {

                const h1 = document.createElement('h1');
                h1.innerHTML = 'My posts';
                h1.classList.add('noPosts');
                div2.appendChild(h1);
                const inOrder = user.posts.reverse();
                inOrder.forEach(post => {
                    populatePost(user.username, post, user.myImage);
                });
            }
            //----------------------------------------------------------------------------------------


            // create posts 
            function populatePost(username, Post, source) {
                const post = document.createElement('div');
                const sec1 = document.createElement('div');
                const sec2 = document.createElement('div');
                const img = document.createElement('img');
                const p1 = document.createElement('p');
                const date = document.createElement('p');
                const postInfo = document.createElement('div');
                const p2 = document.createElement('p');
                const button = document.createElement('button');

                // add values to elements
                img.src = 'uploads/' + source;
                p1.innerHTML = username;
                p2.innerHTML = Post.text;
                button.innerHTML = 'comment';
                date.innerHTML = Post.date;

                // add children
                sec1.appendChild(img);
                // sec1.appendChild(p1);
                //sec1.appendChild(date);
                sec2.appendChild(p2);
                sec2.appendChild(button);

                postInfo.appendChild(p1);
                postInfo.appendChild(date);
                sec1.appendChild(postInfo);
                // Classes
                post.classList.add('post');
                sec1.classList.add('sec1');
                sec2.classList.add('sec2');
                p1.classList.add('p1');
                p2.classList.add('p2');
                img.classList.add('img');
                button.classList.add('commentBtn');

                date.classList.add('date');
                postInfo.classList.add('postInfo');

                post.appendChild(sec1);
                post.appendChild(sec2);
                div2.appendChild(post);
                // Option button
                const point1 = document.createElement('div');
                const point2 = document.createElement('div');
                const point3 = document.createElement('div');
                const option = document.createElement('div');
                const edit = document.createElement('div');
                const update = document.createElement('p');
                const delt = document.createElement('p');
                update.innerHTML = 'update post';
                delt.innerHTML = 'delete post';
                update.classList.add('update');
                delt.classList.add('delt');
                edit.appendChild(update);
                edit.appendChild(delt);

                option.classList.add('option');
                edit.classList.add('edit');
                option.appendChild(point1);
                option.appendChild(point2);
                option.appendChild(point3);
                sec1.appendChild(option);
                post.appendChild(edit);
                option.addEventListener('click', () => {
                    edit.classList.toggle('optConfig');
                    post.classList.toggle('posConfg');
                });


                // Update Post
                update.addEventListener('click', () => {
                    // POPUP MODAL  
                    const modalD = document.createElement('div');
                    const childD = document.createElement('div');
                    const closeOff = document.createElement('div');
                    const textCont = document.createElement('textarea');
                    const uptPar = document.createElement('p');
                    const updateBtn = document.createElement('button');

                    uptPar.innerHTML = 'Edit your post...';
                    updateBtn.innerHTML = 'update';
                    textCont.value = Post.text;
                    uptPar.classList.add('uptPar');
                    updateBtn.classList.add('updateBtn');

                    textCont.classList.add('textCont');
                    modalD.classList.add('modalD');
                    childD.classList.add('childD');
                    closeOff.classList.add('closeOff');
                    modalD.appendChild(closeOff);
                    modalD.appendChild(childD);
                    container.appendChild(modalD);
                    // close modal
                    closeOff.addEventListener('click', () => {
                        modalD.style.visibility = 'hidden';
                    });
                    childD.appendChild(uptPar);
                    childD.appendChild(textCont);
                    childD.appendChild(updateBtn);
                    updateBtn.addEventListener('click', () => {
                        if (textCont.value === Post.text) {
                            console.log('please update...');
                            const warning = document.createElement('p');
                            warning.innerHTML = 'please update your post !';
                            warning.classList.add('warning');
                            childD.insertBefore(warning, textCont);
                            setTimeout(() => warning.remove(), 2000);
                        } else {
                            //console.log(textCont.value);
                            const url = 'http://localhost:3000/user/posts/update-one';
                            const putReq = {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    updated: textCont.value,
                                    postId: Post._id
                                })
                            }
                            fetch(url, putReq)
                                .then(res => {
                                    return res.json();
                                }).then(response => {
                                    div2.innerHTML = null;
                                    const h1 = document.createElement('h1');
                                    h1.innerHTML = 'My posts';
                                    h1.classList.add('noPosts');
                                    div2.appendChild(h1);
                                    const inOrder = response.posts.reverse();
                                    inOrder.forEach(post => {
                                        populatePost(user.username, post, user.myImage);
                                    });
                                    childD.innerHTML = null;
                                    const success = document.createElement('h1');
                                    success.innerHTML = 'Post is successfully updated ';
                                    success.classList.add('successUpdt');
                                    childD.appendChild(success);
                                    setTimeout(() => {
                                        modalD.style.visibility = 'hidden';
                                    }, 3000);
                                }).catch(err => console.log('updating post error ' + err));
                        }
                    });
                });

                // Delete Post
                delt.addEventListener('click', () => {
                    if (confirm('Are you sure you wanna delete this post ?')) {
                        const url = 'http://localhost:3000/user/posts/delete-one';
                        const putReq = {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ postId: Post._id })
                        }
                        fetch(url, putReq)
                            .then(res => {
                                return res.json();
                            }).then(response => {
                                div2.innerHTML = null;
                                const h1 = document.createElement('h1');
                                h1.innerHTML = 'My posts';
                                h1.classList.add('noPosts');
                                div2.appendChild(h1);
                                const inOrder = response.delPosts.reverse();
                                inOrder.forEach(post => {
                                    populatePost(user.username, post, user.myImage);
                                });
                            }).catch(err => console.log('deleting post error ' + err));
                    }
                });

                //------------------------------------- DISPLAY COMMENTS BEGINS -------------------------------------
                // add EventListener
                button.addEventListener('click', () => {
                    // FETCH COMMENTS
                    const identifier = {
                        username: username,
                        postId: Post._id
                    }
                    const cmtConfig = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(identifier)
                    }
                    fetch('http://localhost:3000/user/posts/get-comments', cmtConfig).then(res => {
                        return res.json();
                    }).then(ready => {
                        console.log(ready.result);
                        //*********** */

                        // POPUP MODAL
                        const cmtHolder = document.createElement('div');
                        const modalDiv = document.createElement('div');
                        const childDiv = document.createElement('div');
                        const close = document.createElement('div');
                        modalDiv.classList.add('modalDiv');
                        childDiv.classList.add('childDiv');
                        close.classList.add('close');


                        modalDiv.appendChild(close);
                        modalDiv.appendChild(childDiv);
                        container.appendChild(modalDiv);


                        // close modal
                        close.addEventListener('click', () => {
                            modalDiv.style.visibility = 'hidden';
                        });
                        //--------------------COMMENT SIDE --------------------------------------------------------------

                        // Writing Comment
                        const commentDiv = document.createElement('div');
                        const commentInput = document.createElement('input');
                        const sendComment = document.createElement('button');
                        sendComment.innerHTML = 'Send Comment';
                        commentInput.placeholder = 'write comment...';
                        commentDiv.classList.add('commentDiv');
                        commentInput.classList.add('commentInput');
                        sendComment.classList.add('sendComment');
                        commentDiv.appendChild(commentInput);
                        commentDiv.appendChild(sendComment);
                        childDiv.appendChild(commentDiv);
                        childDiv.appendChild(cmtHolder);

                        // Add Event Listener
                        sendComment.addEventListener('click', () => {
                            if (commentInput.value == '') {
                                console.log('please write something');
                            } else {
                                const commentInfo = {
                                    commentVal: commentInput.value,
                                    cmtProvider: user.username,
                                    providerImg: user.myImage,
                                    postId: Post._id,
                                    cmtReceiver: username
                                }
                                const url = 'http://localhost:3000/user/posts/comments';
                                const config = {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(commentInfo)
                                }
                                fetch(url, config).then(result => {
                                    return result.json();
                                }).then(parsed => {
                                    cmtHolder.innerHTML = null;
                                    parsed.exctPost.comments.forEach(comment => {
                                        console.log(comment);
                                        createComment(comment.provider, comment.cmt, comment.providerImg);
                                    });
                                    commentInput.value = '';
                                }).catch(err => console.log(err));
                            }
                        });
                        //---------------------------------------------------------------------------------------------------
                        // Show Comments
                        function createComment(cmtProvider, cmtText, source) {

                            const cmtWrapper = document.createElement('div');
                            const part1 = document.createElement('div');
                            const part2 = document.createElement('div');
                            const userImg = document.createElement('img');
                            const name = document.createElement('p');
                            const comment = document.createElement('p');

                            cmtWrapper.classList.add('cmtWrapper');
                            part1.classList.add('part1');
                            part2.classList.add('part2');
                            userImg.classList.add('userImg');
                            name.classList.add('name');
                            comment.classList.add('comment');

                            userImg.src = 'uploads/' + source;
                            name.innerHTML = cmtProvider;
                            comment.innerHTML = cmtText;

                            part1.appendChild(userImg);
                            part1.appendChild(name);
                            part2.appendChild(comment);
                            cmtWrapper.appendChild(part1);
                            cmtWrapper.appendChild(part2);
                            cmtHolder.appendChild(cmtWrapper);
                            childDiv.appendChild(cmtHolder);
                        }

                        if (ready.result.length <= 0) {
                            console.log('No comments');
                            const h1 = document.createElement('h1');
                            h1.innerHTML = 'No comments sofar';
                            h1.classList.add('noPosts');
                            cmtHolder.appendChild(h1);
                        } else {
                            ready.result.forEach(comment => {
                                createComment(comment.provider, comment.cmt, comment.providerImg);
                            });
                        }
                    }).catch(err => console.log('error in fetching comments ' + err));
                });
            }

        }).catch(err => console.log('server error ' + err));
}

init();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////




const profileBtn = document.querySelector('#profile');

profileBtn.addEventListener('click', () => {

    container.innerHTML = null;
    init();
});