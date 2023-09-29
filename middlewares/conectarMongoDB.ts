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
    const {DB_CONEXAO_STRING} = process.env;
    //se env estiver fazia aborda o uso do sistema e avisa o programador
    if(!DB_CONEXAO_STRING){
      return res.status(500).json({ error: "Env de config do banco de dados nao informado"})
    }

    mongoose.connection.on("conected", () => console.log("Banco de dados conectado"));
    mongoose.connection.on("error", error => console.log(`Erro ao conectar ao banco de dados: ${error}`));
    await mongoose.connect(DB_CONEXAO_STRING);
    return handler(req, res);
  }