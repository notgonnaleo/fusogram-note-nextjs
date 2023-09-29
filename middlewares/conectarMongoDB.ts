import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import mongoose from "mongoose";

export const conectarMongoDB = (handler : NextApiHandler) =>
  async (req: NextApiRequest, res : NextApiResponse) => {

    //verificar se o banco ja esta conectador, se estiver seguir para o endpoint
    //para o endpoint ou proxmiddleware
    if(mongoose.connections[0].readyState){
      return handler(req, res);
    }

    //ja que nao esta conectado, vamos conectar
    //obter a variavel de ambiente preenchida do env
    const {DB_CONEXAO_STRING} = process.env; // TODO: Revisar se sua .env ta realmente sendo chamada
    
    // Hardcoded string de conexao no codigo pra testar
    const conn = "mongodb+srv://riccaguiar:fusogram@fusogram.h9phkpb.mongodb.net/fusogram?retryWrites=true&w=majority";
    
    //se env estiver fazia aborda o uso do sistema e avisa o programador
    
    /* TODO: descomentar isso aqui assim que corrigir o uso do .env
    if(!DB_CONEXAO_STRING)
      return res.status(500).json({ error: "Env de config do banco de dados nao informado"})
    */
    
    mongoose.connection.on("conected", () => console.log("Banco de dados conectado"));
    mongoose.connection.on("error", error => console.log(`Erro ao conectar ao banco de dados: ${error}`));
    await mongoose.connect(conn); // TODO: Voltar essa variavel pra DB_CONEXAO_STRING
    return handler(req, res);
  }
