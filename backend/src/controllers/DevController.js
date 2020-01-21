const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

//Funções de um Controller >
//index; show; store; update; destroy


module.exports = {
    async index(request, response){
        const devs = await Dev.find();

        return response.json(devs);
    },

    async show(request, response){
        //const { github_username } = request.params;

        const dev = await Dev.findOne({ github_username: request.params.id });

        return response.json(dev);
    },

    async store(request, response){
        const { github_username, techs, latitude, longitude } = request.body;

        let dev = await Dev.findOne({ github_username });

        if(!dev){
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);

            const { name = login, avatar_url, bio } = apiResponse.data;
    
            const techsArray = parseStringAsArray(techs);
    
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            };
    
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location
            });

            //Filtrar as conecções que estão á no máximo 10km de distancia e que o novo Dev tenha pelo menos uma das tecnologias fintradas

            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsArray
            );

            sendMessage(sendSocketMessageTo, 'new-dev', dev);
        }

        return response.json(dev);
    },

     async update(request, response){
        return response.json(response);
     },

    async destroy(request, response){       
        await Dev.findOneAndDelete({ github_username: request.params.github_username });
        
        return response.send('Deletado com sucesso!');
    }
};