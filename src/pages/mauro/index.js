import React, { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import imageCompression from 'browser-image-compression';

export default function Mauro() {
  const [blob, setBlob] = useState();
  const [base, setbase] = useState();
  const [ok, setok] = useState(false);
  const [lista, setlista] = useState([]);
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

  //   function getBase64(file) {
  //     // console.log('url', URL.createObjectURL(file));
  //     // seturl(URL.createObjectURL(file));
  //     var reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = function () {
  //       console.log(reader.result);
  //       setbase(reader.result);
  //     };
  //     reader.onerror = function (error) {
  //       console.log('Error: ', error);
  //     };
  //   }
  //   console.log('LISTA ', lista);

  //   console.log('blob', blob);
  //   console.log('base64', base);

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
    // setBlob(output);
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

  //   const getBase64 = (file) => {
  //     console.log('url', URL.createObjectURL(file));
  //     // seturl(URL.createObjectURL(file));
  //     var reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = function () {
  //       console.log(reader.result);
  //       setbase(reader.result);
  //     };
  //     reader.onerror = function (error) {
  //       console.log('Error: ', error);
  //     };
  //   };

  const version = imageCompression.version;
  const { webWorker, mainThread, maxSizeMB, maxWidthOrHeight } = imageStates;

  return (
    <div>
      {/* <input
        type="file"
        onChange={(e) => {
          getBase64(e.target.files[0]);
        }}
      /> */}
      {/* <button onClick={(e) => getBase64(blob)}>OI</button> */}

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
      <p>
        {webWorker.inputSize && (
          <span>Source image size: {webWorker.inputSize} mb</span>
        )}
        {webWorker.outputSize && (
          <span>, Output image size: {webWorker.outputSize} mb</span>
        )}
      </p>

      <img
        src={imageStates.webWorker.outputUrl}
        width={imageStates.maxWidthOrHeight}
      />

      <button
        onClick={() => {
          axios
            .post('http://localhost:3000/api/user', {
              email: 'artr@aaa.com',
              password: 'ara',
              cpf: '123123',
              name: 'artur',
              type: '1',
              base64: base,
            })
            .then((res) => {
              console.log(res);
              setok(true);
            })
            .catch((error) => {
              console.log('error', error);
              setok(false);
            });
        }}
      >
        enviar
      </button>

      <div>
        <p>GRAVOU SEU FILHO DA PUTAA pode fazer o GET AQUI AGORA ARROMBADO</p>
        <button
          style={{ background: 'red' }}
          onClick={() => {
            axios
              .get('http://localhost:3000/api/user')
              .then((res) => {
                console.log(res);
                setlista(res.data);
              })
              .catch((error) => {
                console.log(error);
              });
          }}
        >
          FAÇA O GET AQUI SEU BOSTA
        </button>
      </div>

      {lista
        ? lista.map((item, index) => {
            return <img key={index} src={item.base64} width="300" />;
          })
        : ''}
    </div>
  );
}
