import React from 'react';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSideBar(propriedades) {
  return (
    <Box as="aside">
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: '8px' }}></img>
      <hr />

      <p>
        <a className="boxLink" href={ 'https://github.com/${propriedades.githubUser}' }>
          @{ propriedades.githubUser }
        </a>
      </p>
      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsSideBar(properties)
{
  const maxRelationsShow = properties.maxRelationsShow;
  const relationsLimited = properties.relations.slice(0, properties.maxRelationsShow);

  return (
    <>
    <h2 className="smallTitle">
    Pessoas da Comunidade ({ properties.relations.length })
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
  const maxCommunitiesShow = properties.maxRelationsShow;
  const communitiesLimited = properties.communities.slice(0, properties.maxRelationsShow);

  return (
  <>
  <h2 className="smallTitle">
    Comunidades ({ properties.communities.length })
  </h2>
  <ul>
    { communitiesLimited.map((itemAtual) => {
        return (
          <li key={itemAtual.id}>
            <a href={`/users/${itemAtual.title}`}>
              <img src={itemAtual.image} /> 
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
  const githubUser = 'EdsonGalindo';
  const [comunidades, setComunidades] = React.useState([{
    id: new Date().toISOString(),
    title: 'Eu odeio acordar cedo',
    image: 'https://alurakut.vercel.app/capa-comunidade-01.jpg', //image: 'http://placehold.it/300x300',
  }]);
  const pessoasFavoritas = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho',
    'robertaarcoverde'
  ];  

  return (
    <>
      <AlurakutMenu githubUser={githubUser} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSideBar githubUser={githubUser} />
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
                id: new Date().toISOString(),
                title: dadosDoForm.get('title'),
                image: dadosDoForm.get('image'),
              }
              const comunidadesAtualizadas = [...comunidades, comunidade];
              setComunidades(comunidadesAtualizadas);
            }}>
              <div>
                <input 
                  placeholder="Qual será o nome da sua comunidade?" 
                  name="title" 
                  aria-label="Qual será o nome da sua comunidade?"
                  type="text"
                />
              </div>
              <div>
                <input 
                  placeholder="Coloque uma URL para usarmos de capa" 
                  name="image" 
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
            <CommunitiesSideBar communities={comunidades} maxCommunitiesShow={6} />
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBoxWrapper>
            <ProfileRelationsSideBar relations={pessoasFavoritas} maxRelationsShow={6} />
          </ProfileRelationsBoxWrapper>   
        </div>   
      </MainGrid>
    </>
  )
}
