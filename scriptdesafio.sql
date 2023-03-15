DROP TABLE `sales_transactions`;

CREATE TABLE `sales_transactions` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`type` INT(11) NOT NULL,
	`datetime` VARCHAR(255),
	`product` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci,
	`value` DECIMAL(10.2),
	`seller` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci,
	PRIMARY KEY (`id`)
);

INSERT INTO sales_transactions(id,type,datetime,product,value,seller) VALUES(0, 1, '2022-03-01T02:09:54-03:00', 'DOMINANDO INVESTIMENTOS', '0000012750','ELIANA NOGUEIRA');

    -- // | Campo    | Início | Fim | Tamanho | Descrição                      |
    -- // | -------- | ------ | --- | ------- | ------------------------------ |
    -- // | Tipo     | 1      | 1   | 1       | Tipo da transação              |
    -- // | Data     | 2      | 26  | 25      | Data - ISO Date + GMT          |
    -- // | Produto  | 27     | 56  | 30      | Descrição do produto           |
    -- // | Valor    | 57     | 66  | 10      | Valor da transação em centavos |
    -- // | Vendedor | 67     | 86  | 20      | Nome do vendedor               |
    