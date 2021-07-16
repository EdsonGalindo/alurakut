import React from 'react';
// Hook do NextJS
import { useRouter } from 'next/dist/client/router'; 'next/router';
import nookies from 'nookies';

export default function LoginPage()
{
    const router = useRouter();
    const [githubUser, setGithubUser] = React.useState('');
    
    const query = router.query;
    const loginError = query?.error;
    console.log(loginError);

    return (
        <main style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <div className="loginScreen">
            <section className="logoArea">
              <img src="https://alurakut.vercel.app/logo.svg" />
    
              <p><strong>Conecte-se</strong> aos seus amigos e familiares usando recados e mensagens instantâneas</p>
              <p><strong>Conheça</strong> novas pessoas através de amigos de seus amigos e comunidades</p>
              <p><strong>Compartilhe</strong> seus vídeos, fotos e paixões em um só lugar</p>
            </section>
    
            <section className="formArea">
              <form className="box" onSubmit={(informacoesEvento) => {
                    informacoesEvento.preventDefault();

                    fetch('https://alurakut.vercel.app/api/login', {
                        method: 'POST',
                        Headers: {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ githubUser: githubUser})
                      })
                      .then(async (respostaServidor) => {
                        const dadosResposta = await respostaServidor.json();
                        const token = dadosResposta.token;
                        nookies.set(null, 'USER_TOKEN', token, {
                            path: '/',
                            maxAge: 86400 * 7
                        });
                        router.push('/');
                      })                    
                }} >
                <p>
                  Acesse agora mesmo com seu usuário do <strong>GitHub</strong>!
                </p>
                <input
                    placeholder="Usuário"
                    value={githubUser}
                    onChange={(evento) => {
                        setGithubUser(evento.target.value)
                    }}
                />
                {!loginError && githubUser.length === 0
                    ? 'Informe seu usuário do GitHub!'
                    : ''
                }
                <font className='errorMessagesStyle'>
                {loginError == 'token_undefined'
                    ? 'Erro na obtenção do Token de acesso!'
                    : ''
                }
                {loginError == 'auth_fail'
                    ? 'Falha de autenticação!'
                    : ''
                }
                </font>
                <button type="submit" disabled={!githubUser? true : false}>
                  Login
                </button>
              </form>
    
              <footer className="box">
                <p>
                  Ainda não é membro? <br />
                  <a href="/login">
                    <strong>
                      ENTRAR JÁ
                  </strong>
                  </a>
                </p>
              </footer>
            </section>
    
            <footer className="footerArea">
              <p>
                © 2021 alura.com.br - <a href="/">Sobre o Orkut.br</a> - <a href="/">Centro de segurança</a> - <a href="/">Privacidade</a> - <a href="/">Termos</a> - <a href="/">Contato</a>
              </p>
            </footer>
          </div>
        </main>
      )
}