INSERT INTO "User" (email, nome, senha, tipo) VALUES
('luciano@gmail.com','Luciano', '12345678', 2), --considere id 1
('marcelo@gmail.com','Marcelo Henklain', '12345678', 1), --considere id 2
('maely@gmail.com','Maely', '12345678', 1), --considere id 3
('miguel@gmail.com','Miguel', '12345678', 1), --considere id 4
('marcelle@gmail.com','Marcelle Urquiza', '12345678', 1), --considere id 5
('thais@gmail.com','Thais', '12345678', 1), --considere id 6
('herbert@gmail.com','Herbert Rocha', '12345678', 1), --considere id 7
('acauan@gmail.com','Acauan Ribeiro', '12345678', 1), --considere id 8
('dwan@gmail.com','Felipe Dwan', '12345678', 1), --considere id 9
('delfa@gmail.com','Delfa', '12345678', 1), --considere id 10
('lobo@gmail.com','Felipe Lobo', '12345678', 1), --considere id 11
('substituto@gmail.com','Substituto', '12345678', 1), --considere id 12
('balico@gmail.com','Leandro Bálico', '12345678', 1); --considere id 13
-- Adicionando professores

INSERT INTO "Semester" (nome, prioridade) VALUES
('primeiro semestre', 1), --considere id 1
('segundo semestre', 2), --considere id 2
('terceiro semestre', 3), --considere id 3
('quarto semestre', 4), --considere id 4
('quinto semestre', 5), --considere id 5
('sexto semestre', 6), --considere id 6
('sétimo semestre', 7), --considere id 7 
('oitavo semestre', 8), --considere id 8
('semestre complementar', 9); --considere id 9
-- Adicionando semestres

INSERT INTO "Materia" ("nome", "semestreId", "professorId") VALUES 
('DCC103-IntroduçãoaSistemasdeComputação', 1, 2), --considere id 1
('DCC104-LógicaProposicional', 1, 3), --considere id 2
('DCC105-Algoritmos', 1, 4), --considere id 3
('DCC106-EletricidadeBásica', 1, 5), --considere id 4
('MB103-MatemáticaBásica', 1, NULL), --considere id 5
('DCC204-CircuitosDigitaisI', 2, 5), --considere id 6
('MB105-GeometriaAnalítica', 2, NULL), --considere id 7
('DCC205-ProgramaçãoEstruturada', 2, 4), --considere id 8
('MB201-CálculoDiferencialeIntegralI', 2, NULL), --considere id 9
('DCC206-LinguagensdeProgramação', 2, 6), --considere id 10
('DI712-Direitoeéticanacomputação', 2, NULL), --considere id 11
('DCC301-ArquiteturaeOrganizaçãodeComputadores', 3, 7), --considere id 12
('DCC302-EstruturadeDadosI', 3, 8), --considere id 13
('DCC305-ProgramaçãoOrientadaaObjetos', 3, 9), --considere id 14
('AD410-FormaçãoprofissionaldoAdministrador', 3, NULL), --considere id 15
('MB202-ÁlgebraLinearI', 3, NULL), --considere id 16
('DCC402-EngenhariadeSoftwareI', 4, 10), --considere id 17
('MB205-EstatísticaI', 4, NULL), --considere id 18
('DCC403-SistemasOperacionais', 4, 7), --considere id 19
('DCC405-EstruturadeDadosII', 4, 8), --considere id 20
('DCC407-RedesdeComputadoresI', 4, 11), --considere id 21
('MB302-CálculoDiferencialeIntegralII', 4, NULL), --considere id 22
('MB303-MatemáticaDiscreta', 4, NULL), --considere id 23
('DCC502-BancodeDadosI', 5, 8), --considere id 24
('DCC507-RedesdeComputadoresII', 5, 11), --considere id 25
('MB910-EstatísticaII', 5, NULL), --considere id 26
('DCC508-FundamentosdaComputação', 5, 3), --considere id 27
('DCC509-EngenhariadeSoftwareII', 5, 6), --considere id 28
('DCC510-ProgramaçãoemBaixoNível', 5, 12), --considere id 29
('DCC511-LógicadePredicados', 5, 3), --considere id 30
('DCC602-SistemasDistribuídos', 6, 13), --considere id 31
('DCC603-BancodeDadosII', 6, 8), --considere id 32
('DCC605-ConstruçãodeCompiladores', 6, 4), --considere id 33
('DCC606-AnálisedeAlgoritmos', 6, 7), --considere id 34
('DCC607-InteligênciaArtificial', 6, 9), --considere id 35
('DCC703-ComputaçãoGráfica', 7, 1), --considere id 36
('DCC704-ArquiteturaeTecnologiasdeSistemasWeb', 7, 8), --considere id 37
('DCC705-TrabalhodeConclusãodeCursoI', 7, NULL), --considere id 38
('DCC706-MetodologiaDePesquisaParaCiênciaDaComputação', 7, 2), --considere id 39
('DCC707-InterfaceHomem-Máquina', 7, 1), --considere id 40
('DCC802-ProjetoeImplementaçãodeSistemas', 8, 2), --considere id 41
('DCC803-TrabalhodeConclusãodeCursoII', 8, NULL), --considere id 42
('DCC804-AtividadesComplementares', 9, NULL); --considere id 43
-- Inserção das matérias