import React, { useRef, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import cookie from 'js-cookie';
import FileBase64 from 'react-file-base64';
import imageCompression from 'browser-image-compression';

function SignUp() {
  const Router = useRouter();
  const [dataUri, setDataUri] = useState('');
  const [files, setFiles] = useState([]);
  const [base, setbase] = useState();
  const [imageStates, setImageStates] = useState({
    maxSizeMB: 1,
    maxWidthOrHeight: 400,
    webWorker: {
      progress: null,
      inputSize: null,
      outputSize: null,
      inputUrl: null,
      outputUrl: null,
    },
    mainThread: {
      progress: null,
      inputSize: null,
      outputSize: null,
      inputUrl: null,
      outputUrl: null,
    },
  });

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
        base64: base,
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

  const handleChange = (e) => {
    setImageStates({ [e.target]: e.currentTarget.value });
  };

  const onProgress = (p, useWebWorker) => {
    const targetName = useWebWorker ? 'webWorker' : 'mainThread';
    setImageStates((prevState) => ({
      ...prevState,
      [targetName]: {
        ...prevState[targetName],
        progress: p,
      },
    }));
  };

  const compressImage = async (e, useWebWorker) => {
    const file = e.target.files[0];
    console.log('input', file);
    console.log(
      'ExifOrientation',
      await imageCompression.getExifOrientation(file)
    );
    const targetName = useWebWorker ? 'webWorker' : 'mainThread';
    setImageStates((prevState) => ({
      ...prevState,
      [targetName]: {
        ...prevState[targetName],
        inputSize: (file.size / 1024 / 1024).toFixed(2),
        inputUrl: URL.createObjectURL(file),
      },
    }));
    var options = {
      maxSizeMB: imageStates.maxSizeMB,
      maxWidthOrHeight: imageStates.maxWidthOrHeight,
      useWebWorker,
      onProgress: (p) => onProgress(p, useWebWorker),
    };
    const output = await imageCompression(file, options);
    console.log('output', output);
    var reader = new FileReader();
    reader.readAsDataURL(output);
    reader.onload = function () {
      console.log(reader.result);
      setbase(reader.result);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
    setImageStates((prevState) => ({
      ...prevState,
      [targetName]: {
        ...prevState[targetName],
        outputSize: (output.size / 1024 / 1024).toFixed(2),
        outputUrl: URL.createObjectURL(output),
      },
    }));
  };

  const version = imageCompression.version;
  const { webWorker, mainThread, maxSizeMB, maxWidthOrHeight } = imageStates;

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
        <label htmlFor="cpf">
          Cpf
          <input
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            name="cpf"
            type="text"
            required
          />
        </label>
        <br />
        <label htmlFor="password">
          password
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            type="password"
            required
          />
        </label>
        <br />
        <label htmlFor="name">
          name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            name="name"
            type="text"
            required
          />
        </label>
        <br />

        <label htmlFor="web-worker">
          Compress in web-worker{' '}
          {webWorker.progress && <span>{webWorker.progress} %</span>}
          <input
            id="web-worker"
            type="file"
            accept="image/*"
            onChange={(e) => compressImage(e, true)}
          />
        </label>
        <br />
        {/* <p>
          {webWorker.inputSize && (
            <span>Source image size: {webWorker.inputSize} mb</span>
          )}
          {webWorker.outputSize && (
            <span>, Output image size: {webWorker.outputSize} mb</span>
          )}
        </p> */}
        <img
          src={imageStates.webWorker.outputUrl}
          width={imageStates.maxWidthOrHeight}
        />

        <br />

        {/* <FileBase64 multiple={false} onDone={(e) => getFiles(e)} />

        <img src={dataUri} width="200" height="200" alt="image" /> */}

        <input type="submit" value="Submit" />
        {signupError && <p style={{ color: 'red' }}>{signupError}</p>}
      </form>
    </div>
  );
}

export default SignUp;
