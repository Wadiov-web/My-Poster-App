const container2 = document.querySelector('.dynamicDiv');

const homeBtn = document.querySelector('#home');

homeBtn.addEventListener('click', () => {

    container2.innerHTML = null;

    const p = document.createElement('p');
    p.innerHTML = 'home';
    p.classList.add('pageTag');
    container2.appendChild(p);
    //----------------------------------------------------------------------------------------------------------------------------

    //--------------------------------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------------


    fetch('http://localhost:3000/user/data')
        .then(res => {
            return res.json();
        }).then(user => {

            // Search Bar
            const searchDiv = document.createElement('div');
            const searchInput = document.createElement('input');
            const result = document.createElement('div');
            const searchBtn = document.createElement('button');
            const inputDiv = document.createElement('div');
            searchBtn.innerHTML = 'get';
            searchInput.placeholder = 'Search...';
            searchDiv.classList.add('searchDiv');
            searchInput.classList.add('searchInput');
            result.classList.add('result');
            searchBtn.classList.add('searchBtn');
            inputDiv.classList.add('inputDiv');
            inputDiv.appendChild(searchInput);
            inputDiv.appendChild(searchBtn);
            searchDiv.appendChild(inputDiv);
            searchDiv.appendChild(result);
            container2.appendChild(searchDiv);


            function usersResult(username, source) {
                const searchedUser = document.createElement('div');
                const userImg = document.createElement('img');
                const name = document.createElement('p');
                searchedUser.classList.add('user');
                userImg.classList.add('myuserImg');
                name.classList.add('names');
                userImg.src = 'uploads/' + source;
                name.innerHTML = username;
                searchedUser.appendChild(userImg);
                searchedUser.appendChild(name);
                result.appendChild(searchedUser);

                // VISIT PROFILE
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                searchedUser.addEventListener('click', () => {
                    console.log(username);
                    if (username == user.username) {
                        console.log('user is logged in !')
                    } else {
                        container2.innerHTML = null;

                        function profileBar(accountName, source) {
                            const profBar = document.createElement('div');
                            const img = document.createElement('img');
                            const username = document.createElement('p');
                            img.src = 'uploads/' + source;
                            username.innerHTML = accountName;
                            img.classList.add('image');
                            username.classList.add('username');
                            profBar.appendChild(img);
                            profBar.appendChild(username);
                            profBar.classList.add('infoWrapper');
                            container2.appendChild(profBar);
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

                        const config = {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ text: username })
                        }


                        fetch('http://localhost:3000/get-visited-user/data', config)
                            .then(res => {
                                return res.json();
                            }).then(visitedUser => {

                                const h = document.createElement('h1');
                                h.innerHTML = 'Welcome to ' + visitedUser.user.username + ' profile';
                                h.classList.add('shoot');
                                container2.appendChild(h);
                                profileBar(visitedUser.user.username, visitedUser.user.myImage);

                                // posts container
                                const wrapper = document.createElement('div');
                                const div1 = document.createElement('div');
                                const div2 = document.createElement('div');

                                wrapper.classList.add('wrapper');
                                div1.classList.add('div1');
                                div2.classList.add('div2');
                                wrapper.appendChild(div1);
                                wrapper.appendChild(div2);
                                container2.appendChild(wrapper);

                                if (visitedUser.user.posts.length <= 0) {
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
                                    const inOrder = visitedUser.user.posts.reverse();
                                    inOrder.forEach(post => {
                                        visitedPost(visitedUser.user.username, post, visitedUser.user.myImage);
                                    });
                                }
                                //--------------------------------------------------------------------------------------
                                // create posts 
                                function visitedPost(username, Post, source) {
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
                                            container2.appendChild(modalDiv);

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
                                    })
                                }

                            }).catch(err => console.log('server error ' + err));
                    }
                });
            }
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            searchBtn.addEventListener('click', () => {

                if (searchInput.value == '') {
                    result.style.display = 'none';
                } else {
                    console.log(searchInput.value);
                    result.style.display = 'block';
                    const data = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ myuser: searchInput.value })
                    }
                    const url = 'http://localhost:3000/search-users';
                    fetch(url, data)
                        .then(json => {
                            return json.json();
                        }).then(parsed => {
                            if (parsed.msg == 'no result') {
                                result.innerHTML = null;
                                const noResult = document.createElement('p');
                                noResult.innerHTML = 'No Result';
                                noResult.classList.add('noResult');
                                result.appendChild(noResult);
                            } else {
                                result.innerHTML = null;
                                console.log(parsed.msg);
                                usersResult(parsed.msg, parsed.img);
                            }
                        }).catch(err => console.log('fetching searched users' + err));
                }
            });


            // posts container
            const wrapper = document.createElement('div');
            const div1 = document.createElement('div');
            const div2 = document.createElement('div');

            wrapper.classList.add('wrapper');
            div1.classList.add('div1');
            div2.classList.add('div2');
            wrapper.appendChild(div1);
            wrapper.appendChild(div2);
            container2.appendChild(wrapper);
            // Profile Bar
            function profileBar(accountName, source) {
                const profBar = document.createElement('div');
                const img = document.createElement('img');
                const username = document.createElement('p');

                img.src = 'uploads/' + source;
                username.innerHTML = accountName;

                img.classList.add('myimage');
                username.classList.add('myusername');

                profBar.appendChild(img);
                profBar.appendChild(username);
                profBar.classList.add('infoWrapper');
                div1.appendChild(profBar);
            }
            profileBar(user.username, user.myImage);

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
                            console.log(data)
                        }).catch(err => console.log(err));
                    textArea.value = '';
                }
            });
            // Populate all users posts
            fetch('http://localhost:3000/all-users/posts')
                .then(res => {
                    return res.json();
                }).then(all => {
                    const h1 = document.createElement('h1');
                    h1.innerHTML = 'see new posts';
                    h1.classList.add('noPosts');
                    div2.appendChild(h1);
                    all.users.forEach(user => {
                        user.posts.forEach(post => {
                            console.log(post);
                            populatePost(user.username, post, user.myImage)
                        });
                    });
                }).catch(err => console.log(err));



            //-------------------------------------------------------------------------------------------






















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

                // Visit profile click
                //////////////////////////////////////////////////////////////////////////////////////////////////////////
                //////////////////////////////////////////////////////////////////////////////////////////////////////////////
                p1.addEventListener('click', () => {
                    console.log(username);
                    if (username == user.username) {
                        console.log('user is logged in !')
                    } else {
                        container2.innerHTML = null;

                        function profileBar(accountName, source) {
                            const profBar = document.createElement('div');
                            const img = document.createElement('img');
                            const username = document.createElement('p');
                            img.src = 'uploads/' + source;
                            username.innerHTML = accountName;
                            img.classList.add('image');
                            username.classList.add('username');
                            profBar.appendChild(img);
                            profBar.appendChild(username);
                            profBar.classList.add('infoWrapper');
                            container2.appendChild(profBar);
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



                        const config = {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ text: username })
                        }


                        fetch('http://localhost:3000/get-visited-user/data', config)
                            .then(res => {
                                return res.json();
                            }).then(visitedUser => {

                                const h = document.createElement('h1');
                                h.innerHTML = 'Welcome to ' + visitedUser.user.username + ' profile';
                                h.classList.add('shoot');
                                container2.appendChild(h);
                                profileBar(visitedUser.user.username, visitedUser.user.myImage);
                                // posts container
                                const wrapper = document.createElement('div');
                                const div1 = document.createElement('div');
                                const div2 = document.createElement('div');

                                wrapper.classList.add('wrapper');
                                div1.classList.add('div1');
                                div2.classList.add('div2');
                                wrapper.appendChild(div1);
                                wrapper.appendChild(div2);
                                container2.appendChild(wrapper);

                                if (visitedUser.user.posts.length <= 0) {
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
                                    const inOrder = visitedUser.user.posts.reverse();
                                    inOrder.forEach(post => {
                                        visitedPost(visitedUser.user.username, post, visitedUser.user.myImage);
                                    });
                                }
                                //------------------------------------------------------------------------------------------


                                // create posts 
                                function visitedPost(username, Post, source) {
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
                                            container2.appendChild(modalDiv);

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
                                    })
                                }

                            }).catch(err => console.log('server error ' + err));
                    }
                });


                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
                        // Add Event Listener SEND COMMENT
                        sendComment.addEventListener('click', () => {

                            if (commentInput.value == '') {
                                console.log('please write something');
                            } else {
                                const commentInfo = {
                                    commentVal: commentInput.value,
                                    cmtProvider: user.username,
                                    providerImg: user.myImage,
                                    cmtReceiver: username,
                                    postId: Post._id
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
                                }).catch(err => console.log(err));
                            }
                            commentInput.value = '';
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
            //---------------------------------------------------------------------------------------------------------


        }).catch(err => console.log('server error ' + err));
});