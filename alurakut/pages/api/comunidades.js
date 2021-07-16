import { SiteClient } from 'datocms-client';

export default async function recebedorDeRequests(request, response)
{
    if (request.method === 'POST')
    {
        const datoCMSToken = '7edc3cc690afd7bd939e2c0ecba1c4';
        const client = new SiteClient(datoCMSToken);

        const registroCriado = await client.items.create({
            itemType: "968556",
            ...request.body,
        })

        response.json({
            registroCriado: registroCriado,
        })

        return;
    }

    response.status(404).json({
        mesage: 'Ainda não temos nada no GET, mas no POST tem!'
    })
}