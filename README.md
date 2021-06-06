# Projeto "Blog" feito com NextJS + MaterialUI e MongoDB

## Breve descrição

Esse projeto foi feito para o Processo Seletivo da Mind Consulting e utiliza inteiramente NextJS, um framework do ReactJS.
Este site contém uma pagina inicial que reconhece se o usuário esta ou não "logado", e mostra o conteúdo de acordo com essa variável.
Uma tela de Login Simples que recebe o Email e Senha de um usuário já registrado e uma tela de SignUp feito para registrar usuários comuns e definir suas informações iniciais.
Quando o usuário comum estiver logado ele tera visão total do conteúdo e ao entrar em seu perfil ele verá suas informações sendo mostradas na tela com a possibilidade e atualizar o seu CPF, EMAIL e NOME.
No caso do usuário ser um administrador ele tera visão do conteúdo como um usuário comum, porém em seu perfil se encontra um formulário que o possibilita de modificar, atualizar e deletar as informações se desejado, é possível somente desativa-lo, contendo também uma tabela listando todos os usuários e mostrando todas as suas informações.

## Como usar

Ao entrar você ira se deparar com uma tela dizendo que você deve se cadastrar ou se "logar", o cadastro é feito clicando no botão de SignUP e a entrada feita no botão de Login, caso a pessoa tenha entrado antes o login sera mantido, sendo essa verificação feita por “cookies”.
Após você se cadastrar você tera a categoria de um usuário comum, este usuário pode visitar seu perfil clicando na sua foto ou nome e clicando no botão "Perfil" e lá suas informações serão mostradas e podem ser editadas.
Já com o administrador ele poderá acessar o perfil da mesma maneira, porém em seu perfil haverá um "form." em que ele pode colocar o userId de certo user e assim modifica-lo, exclui-lo ou o desativar.

## Sobre o código

Nesta seção vou explicar um pouco sobre como o site foi montado, o que eu usei, e a ideia por trás de cada ação feita no código.

### Código

Utilizei NextJS que já tem um sistema integrado de rotas, e de api.
Como aparece na foto, as rotas são arquivos, e ao criar a pasta ela necessita de um arquivo "index" para que seja a rota inicial. 

![NextJS Routes](https://user-images.githubusercontent.com/68618179/120930390-6e840400-c6c3-11eb-86c6-e19741801cfe.png)

#### Cadastro

O código desta pagina é bem direto então vou passar listando o que acho mais interessante.
Se trata de uma pagina de SignUp normal que contém um form que faz um post e manda as informações para o Back-End que então manda para o banco de dados.
Se o usuario já estiver se cadastrado antes com o mesmo email BackEND retorna um error falando que a conta já é existente

![BackEnd Cadastro](https://user-images.githubusercontent.com/68618179/120931034-36ca8b80-c6c6-11eb-83c4-82971719b1ba.png)

Como pode-se ver na foto acima, quando o user passar pelo autenticação basica do "form" e mandar o Post Request ele ira retornar se alguma informação do usuario estiver faltando, a foto é opcional e esta sendo mandada como 'base64', mongodb complicou muito o envio de 'blob', continuando ele ira fazer a conexão com o banco de dados, ira desestruturar o "req.body" de onde todos os dados estão vindo e então ira rodar a função ```findUser(db, email, callback)```

![FINDUSER FUNCTION](https://user-images.githubusercontent.com/68618179/120931379-a2612880-c6c7-11eb-9df6-c046653b6400.png)

Que é apenas uma medida de segurança onde ele ira procurar pelo user, caso algum erro no banco de dados aconteça, Erro 500 sera retornado, caso nenhum usuario apareça
ele prossiguira com o cadastro, onde a função ```createUser(db,email,cpf,password,name,type,active,base64,callback)```

![CreateUser Function](https://user-images.githubusercontent.com/68618179/120931541-5f538500-c6c8-11eb-8656-9e30b22ec059.png)

Nesta função a magica acontece, todos os dados serão passados parametros, em conjunto com a conexão do banco de dados "db", e o callback que ira returnar o usuario criado em caso de nenhum "err" seja detectado.
Nesta função sera feito a criação de um userId com a lib "uuid" e "password" sera criptada utilizando a função ```.hash``` da lib bcrypt, ```bcrypt.hash(password, saltRounds, function (err, hash, () => {}))``` sendo saltRounds uma const = 10, após isso o token do usuario sera criado
```
(creationResult) => {
            if (creationResult.ops.length === 1) {
              const user = creationResult.ops[0];
              const token = jwt.sign(
                { userId: user.userId, email: user.email },
                jwtSecret,
                { expiresIn: 60 * 60 } //60 minutes
              );
              res.status(200).json({ token });
              return;
            }
          }
          
```
e então mandado como resposta e setado como cookie.
E caso o user já exista 
``` res.status(403).json({ error: true, message: "Email exists" });```
Um erro sera retornado.

#### Login

Login é mais simples ainda que o cadastro, o usuario deve informar seu Email e Senha se o Email for aceito pelo frontend ele ira fazer um POST para "/api/auth"

![Auth API](https://user-images.githubusercontent.com/68618179/120932028-890dab80-c6ca-11eb-84c1-e62940ef1892.png)

Seguindo a mesma lógica do cadastro o Login ira checar se alguma informação esta faltando e então se falso ira se conectar com o banco de dados, após a conexão com o banco de dados acontecer a função ``findUser(db, email, callback)`` ira rodar, sendo a mesma do endpoint ``/signup``, caso algum erro aconteça codigo 500 é retornado, se o usuario não for achado Erro 404 sera lançado, e caso nenhumas das anteriores for verdadeira a autenticação do usuario sera feita.

![AuthUser Function](https://user-images.githubusercontent.com/68618179/120932311-a55e1800-c6cb-11eb-9658-43828e0386ba.png)

Está função vai estar recebendo as informações enviadas pelo usuario no form Login, e a senha que está guardada no banco de dados (que pode parecer com isso ```$2b$10$qo5GsXRt32M5I368Y.wf.O5atcIe0K8p6QPlKkHpv80lYbv2BbMm2```), após função rodar um callback ira retornar "match", em caso da senha informada pelo usuario for igual a fornecida pelo banco de dados e então um token sera gerado e setado como cookie pelo front-end ``` cookie.set("token", data.token, { expires: 2 });```

#### Visão dos usuarios no perfil

Nota: Não há conteudo nenhum na pagina principal, é apenas uma "trava" para demonstrar como seria se tivesse algo.

##### Usuario não registrado ou desativados: 

![not logged](https://user-images.githubusercontent.com/68618179/120932670-19e58680-c6cd-11eb-9160-c0823d4048ce.png)

###### Mais a fundo

Esses usuarios não podem ver nada na pagina principal ou no perfil, caso tentem acessar pelo url direto.

##### Usuario comum Registrado: 

![Comum user](https://user-images.githubusercontent.com/68618179/120932753-721c8880-c6cd-11eb-8edc-34fed554432f.png)

###### Mais a fundo

O usuario comum, tem acesso as suas informações e pode modifica-las clicando no botão de "Editar" que vai desbloquear os campos e então ele pode preencher com suas novas informações e enviar através de um metodo "PATCH", que sera enviado para o endpoint do ```api/user```

![Patch method](https://user-images.githubusercontent.com/68618179/120933131-0c310080-c6cf-11eb-8266-0d203e666284.png)

Este código é bem mais direto que os outros dois, ele apenas faz uma verificação checando se as informações principais estão presentes e então faz a conexão com o banco de dados checa se o usuario realmente existe e finalmente atualiza as suas informações.


##### Administrador: 

![Admin](https://user-images.githubusercontent.com/68618179/120932791-9b3d1900-c6cd-11eb-96b6-c5d9b5e392a8.png)

###### Mais a fundo

O administrador é o mais complexo desta seção, eu vou poupar espaço do frontend e focar nas funções da api porém o código esta ![aqui](https://github.com/zhyph/blog-fullstack/blob/main/src/components/AdminProfile.jsx) sendo apenas algumas funções fazendo patch, delete e recebendo todos dados dos usuarios por props.

A função de ```handleSubmit()``` que tera seu trigger quando o form for preenchido e enviado, esta função enviara todos os dados do user para o endpoint ``api/user`` como meotodo PATCH que ira rodar o mesmo processo da atualização de perfil do usuario comum, porém agora adicionando mais informações e tendo mais "poder".

Metodo delete

![metodo delete](https://user-images.githubusercontent.com/68618179/120933855-6da69e80-c6d2-11eb-8ded-6178ae5fbc5d.png)

E por ultimo do endpoint user o DELETE, que ira checar por um userId apenas, e se algum usuario retornar desta busca ele ira deleta-lo pelo userId, retornando uma mensagem de sucesso.

Todos dados dos usuario são pegos fazendo um GET utilizando getServerSideProps:
```
export const getServerSideProps = async (ctx) => {
  const res = await fetch(`${server}/api/user`);

  return {
    props: {
      dados: await res.json(),
    },
  };
};
```

Que faz um fetch no endpoint user e retorna todos users em array, podendo assim fazer a tabela desmonstrada no dashboard do admin

![Get user](https://user-images.githubusercontent.com/68618179/120934090-51efc800-c6d3-11eb-8f89-b79e6195f004.png)


### Considerações finais

* Na pasta api tem um arquivo chamado ``/me.tsx``, oque ele faz é basicamente revalidar se o user esta ou não com o token valido, ele é chamado em toda pagina da aplicação 
```
  const { data, revalidate } = useSWR(
    `${server}/api/me`,
    async function (args) {
      const res = await fetch(args);
      return res.json();
    }
  );
  if (!data) return <h1>Loading...</h1>;
  let loggedIn = false;
  if (data.email) {
    loggedIn = true;
  }
```
Basicamente o código retorna uma verificação do token feita pela lib jwt.verify que compara o token com um "segredo" que esta guardado no .env.local ``const jwtSecret = process.env.JWT_SECRET;``.
* É possivel ver que comecei utilizando tsx e tailwindcss porém decidi mudar para o normal jsx e materialui, pois os outros dois eram um pouco recentes para mim então acabei optando por algo mais familiar
* O projeto utiliza SSR para dar fetch nas informações dos usuarios, porém mais tarde no código percebi que tinha sido uma má ideia, e utilizar context api sera algo melhor, por varios motivos, a unica razão de código continuar com SSR foi o tempo.

Qualquer dúvida ou interesse, estou disponivel no whatsapp ou pelo meu [email](mailto:artur.almeida1@outlook.com). Muito Obrigado!
