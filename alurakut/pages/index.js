import React from 'react';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSideBar(propriedades) {
  return (
    <Box as="aside">
      <img src={`https://github.com/${propriedades.usuarioLogado}.png`} style={{ borderRadius: '8px' }}></img>
      <hr />

      <p>
        <a className="boxLink" href={ 'https://github.com/${propriedades.usuarioLogado}' }>
          @{ propriedades.usuarioLogado }
        </a>
      </p>
      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileFollowersSideBar(properties)
{
  const maxFollowersShow = properties.maxFollowersShow;
  const followersLimited = properties.followers.slice(0, maxFollowersShow);

  return (
    <>
    <h2 className="smallTitle">
    {properties.title} ({ properties.followers.length })
    </h2>
    <ul>
      { followersLimited.map((itemAtual) => {
          return (
            <li key={itemAtual.login}>
              <a href={`https://github.com/${itemAtual.login}`}>
                <img src={`https://github.com/${itemAtual.login}.png`} />
                <span>{itemAtual.login}</span>
              </a>
            </li>
          )
        })
      }
    </ul>
    </>
  )
}

function ProfileRelationsSideBar(properties)
{
  const maxRelationsShow = properties.maxRelationsShow;
  const relationsLimited = properties.relations.slice(0, maxRelationsShow);

  return (
    <>
    <h2 className="smallTitle">
    {properties.title} ({ properties.relations.length })
    </h2>
    <ul>
      { relationsLimited.map((itemAtual) => {
          return (
            <li key={itemAtual}>
              <a href={`/users/${itemAtual}`}>
                <img src={`https://github.com/${itemAtual}.png`} />
                <span>{itemAtual}</span>
              </a>
            </li>
          )
        })
      }
    </ul>
    </>
  )
}

function CommunitiesSideBar(properties)
{
  const maxCommunitiesShow = properties.maxCommunitiesShow;
  const communitiesLimited = properties.communities.slice(0, maxCommunitiesShow);

  return (
  <>
  <h2 className="smallTitle">
    {properties.title} ({ properties.communities.length })
  </h2>
  <ul>
    { communitiesLimited.map((itemAtual) => {
        return (
          <li key={itemAtual.id}>
            <a href={`/users/${itemAtual.id}`}>
              <img src={itemAtual.imageUrl} /> 
              <span>{itemAtual.title}</span>
            </a>
          </li>
        )
      })
    }
  </ul>
  </>
  )
}

export default function Home() {
  const usuarioLogado = 'edsongalindo';
  const [comunidades, setComunidades] = React.useState([]);
  const pessoasFavoritas = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho',
    'robertaarcoverde'
  ];
  
  const [seguidores, setSeguidores] = React.useState([]);
  
  React.useEffect(function () { 
    fetch('https://api.github.com/users/peas/followers')
    .then(function (respostaDoServidor) {
        return respostaDoServidor.json();
    })
    .then(function (respostaCompleta){
      setSeguidores(respostaCompleta);
    })

    // API GraphQL do DatoCMS
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization' : '9bfc3a30ccf94cf0bd23996f0f7d27',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ "query": `query {
          allCommunities{
            title
            id
            imageUrl
            creatorSlug
          }
        }`})
    })
    .then((response) => response.json())
    .then((respostaCompleta) => {
      const comunidadesDatoCMS = respostaCompleta.data.allCommunities;
      setComunidades(comunidadesDatoCMS);
    })

  }, [])

  
  const [state, setState] = React.useState({
    title: "",
    image: "",
  });

  function handleChange(event){
    setState({ ...state, [event.target.name]: event.target.value });
  };

  return (
    <>
      <AlurakutMenu githubUser={usuarioLogado} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSideBar usuarioLogado={usuarioLogado} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              Bem vindo(a)
            </h1>

            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form onSubmit={function handleCriarComunidade(e) {
              e.preventDefault();
              const dadosDoForm = new FormData(e.target);

              const comunidade = {
                title: dadosDoForm.get('title'),
                imageUrl: dadosDoForm.get('image'),
                creatorSlug: usuarioLogado,
              }

              fetch('/api/comunidades', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(comunidade)
              })
              .then(async (response) => {
                if (response.status != 200)
                {
                  alert('Erro ao incluir a comunidade :( \nTente novamente mais tarde!');
                  return;
                }

                const dadosReponse = await response.json();

                if (response.status == 200)
                {
                  alert('Comunidade incluída com sucesso :D');
                }

                const comunidade = dadosReponse.registroCriado;
                const comunidadesAtualizadas = [...comunidades, comunidade];
                setComunidades(comunidadesAtualizadas);

                // Limpa o formulário após inclusão da comunidade
                setState({title: ""});
                setState({image: ""});
              })
            }}>
              <div>
                <input 
                  placeholder="Qual será o nome da sua comunidade?" 
                  name="title" 
                  value={state.title}
                  onChange={handleChange}
                  aria-label="Qual será o nome da sua comunidade?"
                  type="text"
                />
              </div>
              <div>
                <input 
                  placeholder="Coloque uma URL para usarmos de capa" 
                  name="image"
                  value={state.image}
                  onChange={handleChange}
                  aria-label="Coloque uma URL para usarmos de capa"
                />
              </div>
              <button>
                Criar comunidade
              </button>
            </form>
          </Box>
        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelationsBoxWrapper>
            <ProfileFollowersSideBar title={'Seguidores'} followers={seguidores} maxFollowersShow={6} />
          </ProfileRelationsBoxWrapper> 
          <ProfileRelationsBoxWrapper>
            <CommunitiesSideBar title={'Minhas comunidades'} communities={comunidades} maxCommunitiesShow={6} />
          </ProfileRelationsBoxWrapper> 
          <ProfileRelationsBoxWrapper>
            <ProfileRelationsSideBar title={'Pessoas da comunidade'} relations={pessoasFavoritas} maxRelationsShow={6} />
          </ProfileRelationsBoxWrapper>  
        </div>   
      </MainGrid>
    </>
  )
}
