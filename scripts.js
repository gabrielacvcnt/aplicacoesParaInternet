const supabase_apikey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFic3ZiY3BrZW9ld2Nwb3RvdXJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTYzNDc2MDgsImV4cCI6MjAzMTkyMzYwOH0.L-M4gF7JuU4SSvxplag7rimOAWiblAba6a6hHInjD8A";

async function sendEmail(event) {
  event.preventDefault();

  const user_name = document.getElementById('nome').value;
  const user_email = document.getElementById('email').value;
  const message = document.getElementById('mensagem').value;

  const templateParams = {
    "subject": `Comentário do usuário ${user_name}`,
    "name": user_name,
    "email": user_email,
    "message": message,
  }

  try {
    emailjs.send('service_p084kd9', 'template_7ycnivd', templateParams).then(
      (response) => {
        console.log('Mensagem enviada com sucesso!', response.status, response.text);
      },
      (error) => {
        console.log('Falhou: ' + error.message);
      },
    );
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao enviar email. Tente novamente mais tarde.');
  }
}

async function subscribeOnNewsletter(event) {
  event.preventDefault(); //evitar reload da pagina ao clicar em submit
  
  const userNewsletterEmail = document.getElementById('emailNewsletter').value;
  const response = await fetch('https://absvbcpkeoewcpotourl.supabase.co/rest/v1/newsletter', {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${supabase_apikey}`, //JWT 
      "apikey": supabase_apikey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ "email": userNewsletterEmail }) //converte o trecho passado para json(para envio na API)
  });

  if (!response.ok) {
    alert('Ocorreu algum erro. Talvez esse email já tenha sido cadastrado.');
  } else {
    alert('Cadastro realizado com sucesso.');
  }
}

async function fetchContentData() {
  try {
    const response = await fetch('https://absvbcpkeoewcpotourl.supabase.co/rest/v1/conteudo?order=data_criacao.desc&limit=3', {

      method: "GET",
      headers: {
        "Authorization": `Bearer ${supabase_apikey}`,
        "apikey": supabase_apikey,
      },
    });
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching content data:", error);
    return [];
  }
}  //funcao para retorno do Json (conteudo inserido no database)

function createCard(item) {
  const descricao = item.html.length >= 100 ? item.html.substring(0, 100).concat("...") : item.html;

  return `
    <div class="col-md-4">
      <div class="card mb-4 shadow-sm">
        <img src="${item.img}" class="card-img-top" alt="${item.titulo}">
        <div class="card-body">
          <h5 class="card-title">${item.titulo}</h5>
          <p class="card-text">${descricao}</p>
          <a href="${item.link}" class="btn btn-primary">Acessar</a>
        </div>
      </div>
    </div>
  `;
} //retorna o bootstrap com as variáveis tendo valor buscado na API

async function displayContent() {
  const contentRow = document.getElementById('conteudos');

  if (!contentRow) {
    console.error("Elemento com ID 'conteudos' não foi encontrado.");
    return;
  }

  const data = await fetchContentData();

  if (data.length === 0) {
    contentRow.innerHTML = '<p>Não há conteúdos disponíveis.</p>';
    return;
  }

  data.forEach(item => {
    const cardHTML = createCard(item);
    const cardElement = document.createElement('div');
    cardElement.innerHTML = cardHTML.trim();
    contentRow.appendChild(cardElement.firstChild);
    //manipulação de DOM para tornar o retorno da API em HTML no nosso código
  });
}

document.addEventListener('DOMContentLoaded', displayContent);
//só carrega a função dps da pagina estar carregada, para evitar bugs de nao encontrar o conteúdo
