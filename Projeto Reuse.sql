CREATE DATABASE IF NOT EXISTS reuse;
use reuse;
create table administrador(
	id_administrador INT Primary Key auto_increment,
    nome VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    senha VARCHAR(12) NOT NULL,
    data_cadastro DATE NOT NULL
);

create table categoria(
	id_categoria INT Primary Key auto_increment,
    nome varchar(30) NOT NULL,
    icone text
);

create table usuario(
	id_usuario int primary key NOT NULL auto_increment,
    nome varchar(50) NOT NULL,
    email varchar(50) NOT NULL,
    senha varchar(255) NOT NULL,
    telefone varchar(20),
    localizacao varchar(30),
    foto_perfil text,
    data_cadastro date NOT NULL
);

create table notificacao(
	id_notificacao int primary key auto_increment,
    status_leitura boolean NOT NULL,
    tipo_notificacao varchar(60) NOT NULL,
    conteudo_notificacao varchar(150) NOT NULL,
    data_notificacao date NOT NULL,
    id_usuario_notificado int,
    constraint fk_user foreign key (id_usuario_notificado) references usuario(id_usuario)
);

create table instituicao (
id_instituicao int primary key auto_increment,
nome varchar (50) not null,
email varchar (50) not null,
senha varchar (12) not null,
telefone varchar(20),
localizacao varchar(30),
foto_perfil text,
verificado boolean not null,
data_cadastro date not null,
id_administrador_avaliador int,
constraint fk_adm foreign key (id_administrador_avaliador) references administrador (id_administrador)
);

create table campanha (
id_campanha int primary key auto_increment,
titulo varchar (20) not null,
descricao varchar (50) not null,
meta int,
categoria_necessaria varchar (15) not null,
quantidade_atual int,
status_campanha varchar (15) not null,
id_instituicao_publicante int,
constraint fk_inst foreign key (id_instituicao_publicante) references instituicao(id_instituicao)
);

create table denuncia(
id_denuncia int primary key auto_increment,
tipo_alvo varchar (20) not null,
status_denuncia varchar(20) not null,
motivo_denuncia varchar(50) not null,
data_denuncia date not null,
id_usuario_registrante int,
id_administrador int,
constraint fk_us foreign key (id_usuario_registrante) references usuario(id_usuario),
constraint fk_admin foreign key (id_administrador) references administrador(id_administrador)
);

create table avaliacao (
id_avaliacao int primary key auto_increment,
nota int not null,
comentario varchar (300),
data_avaliacao date not null,
id_usuario_avaliador int,
id_usuario_avaliado int,
foreign key (id_usuario_avaliador) references usuario(id_usuario),
foreign key (id_usuario_avaliado) references usuario(id_usuario)
);

create table solicitacao(
id_solicitacao int primary key auto_increment,
mensagem varchar (300),
local_retirada_sugerido varchar (50),
status_soli varchar (24) not null,
data_solicitacao date,
id_usuario_solicitante int,
constraint fk_soli foreign key (id_usuario_solicitante) references usuario(id_usuario)
);

create table mensagem(
id_mensagem int primary key auto_increment,
conteudo varchar (300) not null,
anexo text,
data_hora date,
lida boolean not null,
id_usuario int,
id_solicitacao int,
constraint fk_msg foreign key (id_usuario) references usuario (id_usuario),
constraint fk_msg2 foreign key (id_solicitacao) references solicitacao(id_solicitacao)
);

create table item(
id_item int primary key auto_increment,
nome varchar (50) not null,
descricao varchar (300) not null,
estado_conservacao varchar (30) not null,
tipo_negociacao varchar (20) not null,
fotos text not null,
localizacao varchar (30) not null,
localizacao_visivel boolean not null,
status_item varchar(15) not null,
data_publicacao date not null,
id_usuario_publicador int,
id_categoria_item int,
constraint fk_item foreign key (id_usuario_publicador) references usuario (id_usuario),
constraint fk_item3 foreign key (id_categoria_item) references categoria(id_categoria)
);

create table solicitacao_item (
id_item int,
id_solicitacao int,
primary key (id_item, id_solicitacao),

foreign key (id_item) references item (id_item),
foreign key (id_solicitacao) references solicitacao (id_solicitacao)
);

INSERT INTO categoria VALUES 
(1, 'Eletronicos', NULL),
(2, 'Moveis', NULL),
(3, 'Livros', NULL),
(4, 'Roupas', NULL),
(5, 'Transporte', NULL);
ALTER TABLE usuario MODIFY senha VARCHAR(255) NOT NULL;
CREATE TABLE IF NOT EXISTS avaliacao_produto (
 id_avaliacao_produto INT AUTO_INCREMENT PRIMARY KEY,
 id_solicitacao INT NOT NULL UNIQUE,
 id_item INT NOT NULL,
 id_usuario_avaliador INT NOT NULL,
 nota TINYINT NOT NULL,
 comentario VARCHAR(300),
 data_avaliacao DATE NOT NULL,
 FOREIGN KEY (id_solicitacao) REFERENCES solicitacao(id_solicitacao),
 FOREIGN KEY (id_item) REFERENCES item(id_item),
 FOREIGN KEY (id_usuario_avaliador) REFERENCES usuario(id_usuario),
 CHECK (nota BETWEEN 1 AND 5)
);
CREATE INDEX idx_item_status ON item(status_item);
CREATE INDEX idx_solicitante ON solicitacao(id_usuario_solicitante);
CREATE INDEX idx_solicitacao_item_item ON solicitacao_item(id_item);

ALTER TABLE denuncia ADD COLUMN descricao_denuncia VARCHAR(500) NULL, ADD COLUMN evidencia VARCHAR(255) NULL, ADD COLUMN id_item_alvo INT NULL, ADD COLUMN id_usuario_alvo INT NULL;
ALTER TABLE mensagem MODIFY data_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE notificacao ADD COLUMN data_hora DATETIME NULL, ADD COLUMN status_envio VARCHAR(20) NOT NULL DEFAULT 'Enviada';
CREATE INDEX idx_mensagem_conversa ON mensagem(id_solicitacao,id_mensagem);
CREATE INDEX idx_notificacao_usuario ON notificacao(id_usuario_notificado,id_notificacao);
CREATE INDEX idx_avaliacao_avaliado ON avaliacao(id_usuario_avaliado);
ALTER TABLE avaliacao ADD COLUMN id_solicitacao INT NULL, ADD CONSTRAINT fk_avaliacao_solicitacao FOREIGN KEY (id_solicitacao) REFERENCES solicitacao(id_solicitacao), ADD UNIQUE KEY uq_avaliador_solicitacao (id_usuario_avaliador,id_solicitacao);
