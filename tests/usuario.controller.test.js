import supertest from "supertest";
import app from "../src/index.js";

describe('POST usuario/novaConta : METHOD create', ()=>{

    it('Pass 200: O usuario deve ser criado',async ()=>{
        const bodyRequest = {
            nome: 'Pablo',
            email: 'p@p.com',
            senha: '123',
            dataNascimento: '1997-09-05'
        } 

        const res = await supertest(app)
        .post('/usuario/novaConta')
        .send(bodyRequest)

        const {status} = res
        const bodyResponse = res.body

        try {
                
            expect(status).toBe(200)
            expect(bodyResponse).toHaveProperty('message')
            expect(bodyResponse.message).toBe("sucesso")
            
            
            } catch (/** @type {any} */ error) {
                const details = {details: bodyResponse}
                throw new Error(`${error.message} \n  ${JSON.stringify(details,null,2)}`)
            }
    })

    it('Error 400: Todos os campos devem ser obrigatorios', async ()=>{
        
        const bodyRequest = 
            {
                nome:'' ,
                email:'' ,
                senha:'' ,
                dataNascimento:'' 
            }
            
        const res = await supertest(app)
        .post('/usuario/novaConta')
        .send(bodyRequest)
        
        const {body,status} = res
        
        try {
                
        expect(status).toBe(400)
        expect(body).toHaveProperty('message')
        expect(body.message).toBe('Os campos são obrigatorios')
            
        } catch (/** @type {any} */ error) {
            const details = {details: body}
            throw new Error(`${error.message} \n  ${JSON.stringify(details,null,2)}`)
        }


    })

   
})