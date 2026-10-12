CREATE PROCEDURE sp_criarUsuario @cpf char(11), @nome varchar(100), @dataNasc smalldatetime, @celular char(11), @email varchar(60), @usuario varchar(15), @senha varchar(15)
	AS BEGIN
		BEGIN TRY
			BEGIN TRANSACTION
			INSERT INTO p_usuarios(cpf,nome,dataNasc,celular,email) 
				VALUES (@cpf,@nome,@dataNasc,@celular,@email);
			INSERT INTO p_login(idUsuario,usuario,senha,dataCadastro) 
				VALUES ((SELECT id FROM p_usuarios WHERE cpf = @cpf),@usuario,@senha,GETDATE());
			COMMIT TRANSACTION
		END TRY
		BEGIN CATCH
			ROLLBACK TRANSACTION
			RAISERROR ('Erro ao cadastrar usuário',15,1)
		END CATCH
	END

	ALTER PROCEDURE sp_criarUsuario @cpf char(11), @nome varchar(100), @dataNasc smalldatetime, @celular char(11), @email varchar(60), @usuario varchar(15), @senha varchar(100)
	AS BEGIN
		BEGIN TRY
			BEGIN TRANSACTION
			INSERT INTO p_usuarios(cpf,nome,dataNasc,celular,email) 
				VALUES (@cpf,@nome,@dataNasc,@celular,@email);
			INSERT INTO p_login(idUsuario,usuario,senha,dataCadastro,isAdm) 
				VALUES ((SELECT id FROM p_usuarios WHERE cpf = @cpf),@usuario,@senha,GETDATE(),0);
			COMMIT TRANSACTION
		END TRY
		BEGIN CATCH
			ROLLBACK TRANSACTION
			DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
			DECLARE @ErrorNumber INT = ERROR_NUMBER();
			DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
			DECLARE @ErrorState INT = ERROR_STATE();
			THROW
		END CATCH
	END