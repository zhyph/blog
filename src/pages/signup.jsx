import React, { useRef, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import cookie from 'js-cookie';
import FileBase64 from 'react-file-base64';

function SignUp() {
  const Router = useRouter();
  const [dataUri, setDataUri] = useState('');
  const [files, setFiles] = useState([]);

  const [signupError, setSignupError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpf, setCpf] = useState('');
  const [name, setName] = useState('');

  //   const getBase64 = (file) => {
  //     return new Promise((resolve, reject) => {
  //       const reader = new FileReader();
  //       reader.onload = () => resolve(reader.result);
  //       reader.onerror = (error) => reject(error);
  //       reader.readAsDataURL(file);
  //     });
  //   };

  //   const imageUpload = (e) => {
  //     const file = e.target.files[0];
  //     getBase64(file).then((base64) => {
  //       // localStorage['fileBase64'] = base64;
  //       setDataUri(base64);
  //       console.debug('file stored', base64);
  //     });
  //   };

  const getFiles = (files) => {
    setFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    fetch('/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        cpf,
        password,
        name,
        type: '1',
        // imageBase64: files.base64,
        // profilePictureRef.current.files[0],
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data && data.error) {
          setSignupError(data.message);
        }
        if (data && data.token) {
          //Set cookie
          cookie.set('token', data.token, { expires: 2 });
          Router.push('/');
        }
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <p>Sign Up</p>
        <label htmlFor="email">
          email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            type="email"
            required
          />
        </label>
        <br />
        <label htmlFor="email">
          Cpf
          <input
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            name="cpf"
            required
            type="text"
          />
        </label>
        <br />
        <label htmlFor="password">
          password
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            required
            type="password"
          />
        </label>

        <label htmlFor="name">
          Name
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            id="name"
            name="name"
            type="text"
            placeholder="Your name"
          />
        </label>

        <br />

        <FileBase64 multiple={false} onDone={(e) => getFiles(e)} />

        <img src={dataUri} width="200" height="200" alt="image" />

        <input type="submit" value="Submit" />
        {signupError && <p style={{ color: 'red' }}>{signupError}</p>}
      </form>
    </div>
  );
}

export default SignUp;
