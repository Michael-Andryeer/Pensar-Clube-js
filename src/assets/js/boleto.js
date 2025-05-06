const toggleModal = () => {
    modal.classList.toggle("hide");
    fade.classList.toggle("hide");
};

const cpfInput = document.querySelector('.cpf');

document.addEventListener("DOMContentLoaded", function() {
    const openModalButton = document.querySelector("#open-modal2");
    const closeModalButton = document.querySelector("#close-modal");
    const modal = document.querySelector("#modal");
    const fade = document.querySelector("#fade");

    openModalButton.addEventListener("click", (event)  => {
        event.preventDefault();
        const cpfInput = document.querySelector('.cpf').value.trim();
        if (cpfInput !== '') {
            // Se o campo de CPF não estiver vazio, chama a função para enviar o CPF
            enviarCPF(cpfInput);
        }
    });

    closeModalButton.addEventListener("click", toggleModal);
    fade.addEventListener("click", toggleModal);
});

function enviarCPF(cpf) {
    const dataAtual = new Date();
    const dataInicial = new Date(dataAtual.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 dias após
    const dataFinal = new Date(dataAtual.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 dias antes

    const dataInicialFormatada = `${(dataInicial.getDate()).toString().padStart(2, '0')}/${(dataInicial.getMonth() + 1).toString().padStart(2, '0')}/${dataInicial.getFullYear()}`;
    const dataFinalFormatada = `${(dataFinal.getDate()).toString().padStart(2, '0')}/${(dataFinal.getMonth() + 1).toString().padStart(2, '0')}/${dataFinal.getFullYear()}`;

    console.log(dataInicialFormatada)
    console.log(dataFinalFormatada)

    const endpoint1 = 'https://proxy.bolt360.com.br/boletoveiculo';
    const endpoint2 = 'https://proxy.bolt360.com.br/buscaboleto';
    const token = 'fab30b494cc936ecb22e22374f2ca4894ce2eb71643785b896d4030660aa27cbd8580eca3e1de3af3f4baf8f5a452ad89a0b30566a06cfa5eae919ed47bea9f68638029bc9b426716cbe30766fa167b1dc607bc76b4794589fae6a9778783823d5bdb8c6446302c2bc64a1a0ddddad9c1cced327d1102193d78c7699e4aafe50573a8bc3b2a591e387be9d2bf1dc8dafba5b6fbd0890ecabae7f90b5ce7e0eb8';

    fetch(endpoint1, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            cpf_associado: cpf,
            data_vencimento_inicial: dataFinalFormatada,
            data_vencimento_final: dataInicialFormatada
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data && data.length > 0) {
            const associado = data[0];
            const nomeAssociado = associado.nome_associado;
            const linhaDigitavel = associado.linha_digitavel;
            const linkBoleto = associado.link_boleto;
            const modalBody = document.querySelector('.modal-body');
            modalBody.innerHTML = `
                <p>Nome do Associado: ${nomeAssociado}</p>
                <p>Linha Digitável: ${linhaDigitavel}</p>
                <p>Link do Boleto: <a href="${linkBoleto}" target="_blank">${linkBoleto}</a></p>
            `;
            cpfInput.value = ''
            toggleModal();
        } else {
            console.error('Nenhum associado encontrado com o CPF fornecido.');
        }
    })
    .catch(error => {
        console.error('Erro ao enviar requisição ao primeiro endpoint:', error);
    });
}