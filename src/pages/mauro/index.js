
import React, { useState } from 'react'
import Image from 'next/image'
import axios from 'axios'





export default function Mauro() {

    const [url, seturl] = useState();
    const [base, setbase] = useState();
    const [ok, setok] = useState(false);
    const [lista, setlista] = useState([]);

    function getBase64(file) {

        console.log('url', URL.createObjectURL(file))
        seturl(URL.createObjectURL(file))
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
           // console.log(reader.result);
            setbase(reader.result)

        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }

console.log('LISTA ',lista)
    return (
        <div>
            <input type='file' onChange={(e) => { getBase64(e.target.files[0]) }} />
            <img src={url} width='300' height='300' />


            <button onClick={() => {


                axios.post('http://localhost:3000/api/user', {
                    email: 'arturzinho@arrombado.com',
                    password: 'chupador de rola',
                    type: '2',
                    cpf: 'chupador de rola grossa',
                    base64: base
                }).then((res) => {
                    console.log(res)
                    setok(true)

                }).catch((error) => {
                    console.log('error')
                    setok(false)
                })


            }
            }>enviar</button>

            <div> <p>'GRAVOU SEU FILHO DA PUTAA    pode fazer o GET AQUI AGORA ARROMBADO '</p> 

            <button style={{background:'red'}} onClick={()=>{
                axios.get('http://localhost:3000/api/user').then((res)=>{
                    console.log(res)
                    setlista(res.data)  

                }).catch((error)=>{
                    console.log(error)
                })

            }}>FAÇA O GET AQUI SEU BOSTA</button>
            </div>
            
            
            
       
 {lista ? lista.map((item , index)=>{

    return(

<img  key={index} src={item.base64} width='300' height='300' />
    )


            }):''} 



        </div>

    )
}