import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import useSWR from 'swr';
import Link from 'next/link';
import cookie from 'js-cookie';
import { NextPage } from 'next';
import { useState } from 'react';
import FileBase64 from 'react-file-base64';

function Home() {
  const [files, setFiles] = useState([]);
  // const [blobUri, setBlobUri] = useState('');
  const { data, revalidate } = useSWR('/api/me', async function (args) {
    const res = await fetch(args);
    return res.json();
  });
  if (!data) return <h1>Loading...</h1>;
  let loggedIn = false;
  if (data.email) {
    loggedIn = true;
  }

  const getFiles = (files) => {
    setFiles(files);
  };

  console.log(files);

  // const getBase64 = (file) => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onload = () => resolve(reader.result);
  //     reader.onerror = (error) => reject(error);
  //     reader.readAsDataURL(file);
  //   });
  // };

  // const imageUpload = (e) => {
  //   const file = e.target.files[0];
  //   getBase64(file).then((base64) => {
  //     // localStorage['fileBase64'] = base64;
  //     setDataUri(base64);
  //     console.debug('file stored', base64);
  //   });
  // };

  return (
    <div>
      <Head>
        <title>Welcome to landing page</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <h1>Simplest login</h1>

      <img src={files.base64} width="450" alt="" />

      {/* <input
        type="file"
        id="imageFile"
        name="imageFile"
        onChange={imageUpload}
      />
    <img src={dataUri} width="200" height="200" alt="image" /> */}

      <FileBase64 multiple={false} onDone={(e) => getFiles(e)} />

      {loggedIn && (
        <>
          <p>Welcome {data.email}!</p>
          <button
            onClick={() => {
              cookie.remove('token');
              revalidate();
            }}
          >
            Logout
          </button>
        </>
      )}
      {!loggedIn && (
        <>
          <Link href="/login">Login</Link>
          <p>or</p>
          <Link href="/signup">Sign Up</Link>
        </>
      )}
    </div>
  );
}

export default Home;
