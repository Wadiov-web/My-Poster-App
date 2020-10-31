const container3 = document.querySelector('.dynamicDiv');
const accountBtn = document.querySelector('#myAccount');

accountBtn.addEventListener('click', () => {
    container3.innerHTML = null;
    const h1 = document.createElement('h1');
    h1.innerHTML = 'Account Setting';
    h1.classList.add('h1');
    container3.appendChild(h1);


    fetch('http://localhost:3000/user/data')
        .then(res => {
            return res.json();
        }).then(user => {

            // Updates wrapper
            const divWrapper = document.createElement('div');
            divWrapper.classList.add('divWrapper');
            container3.appendChild(divWrapper);

            const email = document.createElement('p');
            email.innerHTML = user.email;
            email.classList.add('email');
            divWrapper.appendChild(email);

            // Update profile photo
            const uptPhoto = document.createElement('div');
            uptPhoto.classList.add('uptPhoto');
            divWrapper.appendChild(uptPhoto);

            const par = document.createElement('p');
            const pic = document.createElement('img');
            //form
            const form = document.createElement('form');
            const photoInput = document.createElement('input');
            const submit = document.createElement('input');

            par.innerHTML = 'Change profile photo';
            pic.src = 'uploads/' + user.myImage;

            photoInput.type = 'file';
            submit.type = 'submit';
            submit.value = 'upload file';

            par.classList.add('par');
            photoInput.classList.add('photoInput');
            submit.classList.add('submit');
            pic.classList.add('pic');

            const flex = document.createElement('div');
            flex.classList.add('flex');
            flex.appendChild(form);
            flex.appendChild(pic);

            form.appendChild(photoInput);
            form.appendChild(submit);
            uptPhoto.appendChild(par);
            uptPhoto.appendChild(flex);
            //-------------------------------------------------------------------------------------------------

            // Update username
            const uptUsername = document.createElement('div');
            uptUsername.classList.add('uptUsername');
            divWrapper.appendChild(uptUsername);

            const updtPar = document.createElement('p');
            const usernameInput = document.createElement('input');
            const button = document.createElement('button');
            button.innerHTML = 'update';
            usernameInput.type = 'text';
            usernameInput.value = user.username;
            updtPar.innerHTML = 'update your username';

            updtPar.classList.add('par');
            usernameInput.classList.add('usernameInput');
            button.classList.add('uptBtn');

            uptUsername.appendChild(updtPar);
            uptUsername.appendChild(usernameInput);
            uptUsername.appendChild(button);

            button.addEventListener('click', () => {
                if (usernameInput.value == user.username) {
                    console.log('username not updated');
                } else {
                    console.log(usernameInput.value);
                    fetch('http://localhost:3000/user/update-username', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ newUsername: usernameInput.value })
                    }).then(result => {
                        return result.json();
                    }).then(res => {
                        console.log(res);
                    }).catch(err => console.log(err));
                }
            });


            //---------------------------------------------------------------------------------------------

            // Remove account
            const removeAccount = document.createElement('div');
            removeAccount.classList.add('removeAccount');
            divWrapper.appendChild(removeAccount);

            const removeTitle = document.createElement('p');
            const removePar = document.createElement('p');
            const removeBtn = document.createElement('button');
            removeBtn.innerHTML = 'remove now';
            removeTitle.innerHTML = 'remove my account';
            removePar.innerHTML = `Note that by chosing remove option you will 
            never have access to this account and all the data associated with this account
             (posts, comments, personnel data...) will be erased from the database. 
             Are you sure about this execution ?`;

            removeTitle.classList.add('par');
            removeBtn.classList.add('removeBtn');
            removePar.classList.add('removePar');

            removeAccount.appendChild(removeTitle);
            removeAccount.appendChild(removePar);
            removeAccount.appendChild(removeBtn);

            removeBtn.addEventListener('click', () => {
                // POPUP MODAL  
                const modalD = document.createElement('div');
                const confirmDiv = document.createElement('div');
                const confirmBtn = document.createElement('button');
                const cancelBtn = document.createElement('button');
                const msg = document.createElement('p');

                msg.innerHTML = 'Do you want to delete your account ?';
                confirmBtn.innerHTML = 'delete account';
                cancelBtn.innerHTML = 'cancel';

                msg.classList.add('msg');
                confirmBtn.classList.add('confirmBtn');
                cancelBtn.classList.add('cancelBtn');

                modalD.classList.add('modalD');
                confirmDiv.classList.add('confirmDiv');
                modalD.appendChild(confirmDiv);
                container3.appendChild(modalD);

                confirmDiv.appendChild(msg);
                confirmDiv.appendChild(cancelBtn);
                confirmDiv.appendChild(confirmBtn);
                // close modal
                cancelBtn.addEventListener('click', () => {
                    modalD.style.visibility = 'hidden';
                });

                confirmBtn.addEventListener('click', () => {
                    console.log(1);
                    fetch('http://localhost:3000/user/delete-account')
                    modalD.style.visibility = 'hidden';
                });

            });
        }).catch(err => console.log(err));
});