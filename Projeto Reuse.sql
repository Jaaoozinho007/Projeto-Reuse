create database if not exists ReUse;
use ReUse;
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
    senha varchar(12) NOT NULL,
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
telefone int,
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

INSERT INTO usuario (
    id_usuario,
    nome,
    email,
    senha,
    telefone,
    localizacao,
    foto_perfil,
    data_cadastro
) VALUES
(1, 'Ana Silva', 'anasilvs1@gmail.com', 'Ana2007', 48999209740, 'Curitiba', NULL, '2026-01-10'),
(2, 'Bruno Santos', 'bruninho.silva@gmail.com', 'Bruno874920', 48999209741, 'Curitiba', NULL, '2026-01-12'),
(3, 'Carla Oliveira', 'carlaoliveira@gmail.com', '457212', 48999209742, 'Colombo', NULL, '2026-01-15'),
(4, 'Diego Costa', 'diegolindao@gmail.com', 'DiegoogeiD123', 48999209743, 'Pinhais', NULL, '2026-01-18'),
(5, 'Mariana Souza', 'marianasouza_m@gmail.com', 'MariS25', 48999209744, 'Curitiba', NULL, '2026-01-20');

insert into administrador values
(1, 'Cap Us', 'capus@gmail.com', 'adm01', '2026-03-02'),
(2, 'Andre', 'andresilvaadm@gmail.com', 'adm02', '2026-01-01'),
(3, 'Mathias', 'mathiasadmoficial@gmail.com', 'adm03', '2026-01-01');


insert into instituicao values 
(1, 'Instituto Boa esperança', 'boaesperanca@outlook.com', 'espera123', 41999982391, 'Curitiba-PR', 'instituicao.png', True, '2026-05-05', 2),
(2, 'Instituto nova vida', 'novavida@outlook.com', 'vida123', 41992394912, 'Fazenda Rio Grande-PR', 'boavida.png', True, '2026-07-06', 3),
(3, 'Instituto criança feliz', 'criancafeliz@outlook.com', 'cria123', 41982391024, 'Curitiba-PR', 'criancafeliz.png', True, '2026-08-01', 1);


INSERT INTO categoria (id_categoria, nome, icone) VALUES
(1, 'Eletrônicos', NULL),
(2, 'Móveis', NULL),
(3, 'Livros', NULL),
(4, 'Roupas', NULL),
(5, 'Transporte', NULL);