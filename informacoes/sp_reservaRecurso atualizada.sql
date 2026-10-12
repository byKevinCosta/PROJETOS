create table p_statusRec(
	codigoRec int not null,
	bloqueado bit not null,

	CONSTRAINT pk_p_statusRec
		PRIMARY KEY (codigoRec),
	CONSTRAINT fk_p_statusRec
		FOREIGN KEY (codigoRec)
			REFERENCES p_recursos(codigo)
)

ALTER PROCEDURE sp_reservarRecurso @idRec int, @idUsuario int, @dataInicio smalldatetime, @dataFim smalldatetime
	AS BEGIN
		IF(@dataInicio < GETDATE())
		BEGIN
			RAISERROR ('Data de inicio não pode ser antes que a data atual!',15,1)
			RETURN
		END
		IF (@dataInicio>=@dataFim)
		BEGIN
			RAISERROR ('Data de inicio deve ser menor que a data final!',15,1)
			RETURN
		END
		IF ((SELECT bloqueado FROM p_statusRec WHERE codigoRec = @idRec) = 1)
		BEGIN
			RAISERROR ('Recurso bloqueado para reservas!',15,1)
			RETURN	
		END
		IF EXISTS (SELECT 1 FROM p_reserva 
			WHERE codigoRec = @idRec 
			AND dataInicio < @dataFim
			AND dataFim > @dataInicio)
			BEGIN
				RAISERROR ('Horário já reservado!',15,1)
				RETURN
			END
		INSERT INTO p_reserva(codigoRec,idUsuario,dataInicio,dataFim)
			VALUES (@idRec,@idUsuario,@dataInicio,@dataFim);
	END

	select getdate()

	select * from p_reserva