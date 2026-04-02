import { Injectable } from '@nestjs/common';
import { TenantConnectionService } from 'src/infra/database/tenant-connection.service';

@Injectable()
export class ReceiptService {
  constructor(
    private readonly tenantConnectionService: TenantConnectionService,
  ) {}

  async post(transaction: any, storeId: number = 1, orderId: number) {
    const params = [storeId, orderId];

    const query = `EXECUTE BLOCK (
        P_LOJA_CODIGO INTEGER = ?, 
        P_VEN_NUMERO   INTEGER = ?
    )
    RETURNS
    (
        ID INTEGER
    )
    AS
        -- DECLARE VARIABLE P_LOJA_CODIGO   INTEGER = ?;
        -- DECLARE VARIABLE P_VEN_NUMERO    INTEGER = ?;
        DECLARE VARIABLE P_TERMINAL      INTEGER = 1;
        DECLARE VARIABLE P_USUARIO       INTEGER = 1;
        DECLARE VARIABLE P_ID_SITUACAO   INTEGER = 2;
        DECLARE VARIABLE P_ESPECIE_DOC   VARCHAR(20) = '0';
        DECLARE VARIABLE P_NUM_SESSAO    INTEGER = 101010;
        DECLARE VARIABLE P_LOJ_PERFIL427 CHAR(1) = 'S';

        DECLARE VARIABLE COD_SEG          VARCHAR(6);
        DECLARE VARIABLE COD_TER          VARCHAR(2);
        DECLARE VARIABLE SIT_CODIGO       INTEGER;
        DECLARE VARIABLE LOJ_ESTOQUEAPOIO VARCHAR(1);
        DECLARE VARIABLE ISA_QDTREG       INTEGER;
        DECLARE VARIABLE CPL_PERFIL104    VARCHAR(1);
        DECLARE VARIABLE CPL_PERFIL118    VARCHAR(1);
        DECLARE VARIABLE VEN_SISTEMA      VARCHAR(1);
        DECLARE VARIABLE QTD              INTEGER;
        DECLARE VARIABLE CPL_PERFIL103    VARCHAR(2);
        DECLARE VARIABLE CPL_PERFIL181    VARCHAR(2);
        DECLARE VARIABLE CPL_PERFIL227    VARCHAR(2);
        DECLARE VARIABLE CPL_PERFIL357    VARCHAR(2);
        DECLARE VARIABLE VALOR1           NUMERIC(15,2);
        DECLARE VARIABLE VALOR2           NUMERIC(15,2);
        DECLARE VARIABLE VALOR3           NUMERIC(15,2);
        DECLARE VARIABLE VALOR4           NUMERIC(15,2);
        DECLARE VARIABLE FP2_CODIGO       INTEGER;
        DECLARE VARIABLE FP3_CODIGO       INTEGER;
        DECLARE VARIABLE FP4_CODIGO       INTEGER;
        DECLARE VARIABLE PERCDESC         NUMERIC(18,6);
        DECLARE VARIABLE VEN_TOTALDESC    NUMERIC(18,6);
        DECLARE VARIABLE PERCACRESC       NUMERIC(18,6);
        DECLARE VARIABLE CPL_VALOR214     INTEGER;
        DECLARE VARIABLE VEN_TOTALLIQUIDO NUMERIC(15,2);
        DECLARE VARIABLE SDA_LIQUIDO      NUMERIC(15,2);
        DECLARE VARIABLE SDA_DESCONTO     NUMERIC(15,2);
        DECLARE VARIABLE VEN_TOTALSEG     NUMERIC(15,2);
        DECLARE VARIABLE PRO_SERVICO      VARCHAR(1);
        DECLARE VARIABLE VEN_TOTALENT     NUMERIC(15,2);
    BEGIN
        ID = 0;
        CPL_PERFIL181 = 'N';

        SELECT COALESCE(cpl.cpl_perfil, 'N')
          FROM config_perfil_lojas cpl
        WHERE cpl.loj_codigo = :P_LOJA_CODIGO
          AND cpl.pfl_codigo = 357
          INTO :CPL_PERFIL357;

        SELECT
            COALESCE(ven.ven_totalpp1, 0),
            COALESCE(ven.ven_totalpp2, 0),
            COALESCE(ven.ven_totalpp3, 0),
            COALESCE(ven.ven_totalpp4, 0),
            COALESCE(ven.fp2_codigo, 0),
            COALESCE(ven.fp3_codigo, 0),
            COALESCE(ven.fp4_codigo, 0),
            CASE
                WHEN (
                    SELECT SUM(ivd.ivd_total)
                      FROM itensven ivd
                    WHERE ivd.ivd_operacao IN ('D', 'T')
                      AND ven.ven_numero = ivd.ven_numero
                ) > 0
                THEN (
                    SELECT SUM(ivd.ivd_total)
                      FROM itensven ivd
                    WHERE ivd.ven_numero = ven.ven_numero
                      AND ivd.ivd_operacao = 'V'
                )
                ELSE COALESCE(ven.ven_totalliquido, 0)
            END,
            COALESCE(ven.ven_totalseg, 0),
            CAST(
                CASE
                    WHEN (COALESCE(ven.ven_totaldesc, 0) > 0)
                    AND (COALESCE(
                            (SELECT SUM(ivd.ivd_desconto)
                              FROM itensven ivd
                              WHERE ivd.ivd_operacao = 'V'
                                AND ivd.ven_numero = :P_VEN_NUMERO), 0) = 0)
                    THEN
                        (COALESCE(ven.ven_totaldesc, 0) /
                        CAST(
                            (SELECT SUM(ivd.ivd_total)
                              FROM itensven ivd
                              WHERE ivd.ven_numero = :P_VEN_NUMERO
                                AND ivd.ivd_operacao = 'V')
                        AS NUMERIC(18,6))) * 100.00
                    ELSE 0.00
                END AS NUMERIC(18,5)
            ),
            COALESCE(ven.ven_percacresc, 0),
            COALESCE(ven.ven_valorent, 0),
            COALESCE(ven.ven_totaldesc, 0)
          FROM vendas ven
        WHERE ven.ven_numero = :P_VEN_NUMERO
          AND ven.sit_codigo <= 2
          INTO
            :VALOR1,
            :VALOR2,
            :VALOR3,
            :VALOR4,
            :FP2_CODIGO,
            :FP3_CODIGO,
            :FP4_CODIGO,
            :VEN_TOTALLIQUIDO,
            :VEN_TOTALSEG,
            :PERCDESC,
            :PERCACRESC,
            :VEN_TOTALENT,
            :VEN_TOTALDESC;

        IF (:VEN_TOTALENT > 0) THEN
        BEGIN
            IF (:VEN_TOTALDESC > 0) THEN
            BEGIN
                VEN_TOTALLIQUIDO = :VEN_TOTALLIQUIDO - :VEN_TOTALENT;
                PERCACRESC = 0.00;
            END
            ELSE
                PERCACRESC = CAST(((:VEN_TOTALENT / (:VEN_TOTALLIQUIDO - :VEN_TOTALENT)) * 100) AS NUMERIC(15,2));
        END

        IF (:CPL_PERFIL357 = 'N') THEN
        BEGIN
            VEN_TOTALLIQUIDO = :VEN_TOTALLIQUIDO - :VEN_TOTALSEG;
            VEN_TOTALSEG = 0.00;
        END

        PRO_SERVICO = 'N';

        IF (EXISTS(
            SELECT 1
              FROM itensven ivd
            WHERE ivd.ven_numero = :P_VEN_NUMERO
              AND ivd.ivd_operacao = 'S'
        )) THEN
        BEGIN
            PRO_SERVICO = 'S';
        END

        SELECT
            ven.sit_codigo,
            COALESCE(ven.ven_sistema, 'N')
          FROM vendas ven
        WHERE ven.ven_numero = :P_VEN_NUMERO
          INTO :SIT_CODIGO, :VEN_SISTEMA;

        CPL_PERFIL104 = 'N';

        SELECT COALESCE(loj.loj_estoqueapoio, 'N')
          FROM lojas loj
        WHERE loj.loj_codigo = :P_LOJA_CODIGO
          INTO :LOJ_ESTOQUEAPOIO;

        SELECT COALESCE(cpl.cpl_perfil, '2')
          FROM config_perfil_lojas cpl
        WHERE cpl.loj_codigo = :P_LOJA_CODIGO
          AND cpl.pfl_codigo = 118
          INTO :CPL_PERFIL118;

        SELECT COALESCE(cpl.cpl_perfil, 'S')
          FROM config_perfil_lojas cpl
        WHERE cpl.loj_codigo = :P_LOJA_CODIGO
          AND cpl.pfl_codigo = 103
          INTO :CPL_PERFIL103;

        SELECT COALESCE(cpl.cpl_perfil, '1')
          FROM config_perfil_lojas cpl
        WHERE cpl.loj_codigo = :P_LOJA_CODIGO
          AND cpl.pfl_codigo = 227
          INTO :CPL_PERFIL227;

        SELECT COALESCE(cpl.cpl_perfil, 'N')
          FROM config_perfil_lojas cpl
        WHERE cpl.loj_codigo = :P_LOJA_CODIGO
          AND cpl.pfl_codigo = 104
          INTO :CPL_PERFIL104;

        SELECT COALESCE(cpl.cpl_valor, 5102)
          FROM config_perfil_lojas cpl
        WHERE cpl.loj_codigo = :P_LOJA_CODIGO
          AND cpl.pfl_codigo = 214
          INTO :CPL_VALOR214;

        IF (:P_LOJ_PERFIL427 = 'N') THEN
        BEGIN
            SELECT COUNT(1)
              FROM itensven ivd
            WHERE ivd.loj_codigo = :P_LOJA_CODIGO
              AND ivd.ven_numero = :P_VEN_NUMERO
              INTO :QTD;
        END
        ELSE
            QTD = 1;

        IF (:SIT_CODIGO IN (1, 4)) THEN
        BEGIN
            IF (:CPL_PERFIL118 IN ('1', '3')) THEN
                SIT_CODIGO = 2;
        END

        IF (COALESCE(:QTD, 0) = 0) THEN
            SIT_CODIGO = 1;

        IF (:SIT_CODIGO = 2) THEN
        BEGIN
            ID = 0;

            SELECT COALESCE(ven.sda_numero, 0)
              FROM vendas ven
            WHERE ven.ven_numero = :P_VEN_NUMERO
              AND ven.ven_status IN ('A', 'I')
              INTO :ID;
        END

        IF (:ID = 0) THEN
        BEGIN
            IF (:P_ID_SITUACAO = 2) THEN
            BEGIN
                UPDATE vendas
                  SET sit_codigo   = 2,
                      ven_horabaixa = CURRENT_TIME,
                      ven_databaixa = CURRENT_DATE
                WHERE sit_codigo = 1
                  AND ven_numero = :P_VEN_NUMERO;
            END

            ISA_QDTREG = 0;
            ID = GEN_ID(gen_numerosda, 1);

            IF (:CPL_PERFIL103 = 'L') THEN
            BEGIN
                SELECT *
                  FROM strzero(CAST(:P_TERMINAL AS VARCHAR(2)), 2)
                  INTO :COD_TER;

                SELECT *
                  FROM strzero(CAST(:ID AS VARCHAR(6)), 6)
                  INTO :COD_SEG;

                ID = CAST(:P_LOJA_CODIGO || :COD_TER || :COD_SEG AS INTEGER);
            END

            INSERT INTO saidas_apoio
            (
                sda_numero,
                cli_codigo,
                sda_cpfcnpj,
                sda_nomecli,
                sda_endcli,
                sit_codigo,
                loj_codigo,
                usu_codigo,
                ter_codigo,
                sda_data,
                sda_hora,
                naf_cfop,
                sda_serie,
                sda_numeronf,
                sda_especie,
                sda_prazo,
                sda_total,
                sda_acrescimo,
                sda_percdesc,
                sda_percacresc,
                sda_vrcanc,
                sda_promocional,
                sda_vrtotalnf,
                sda_vrbasecalc,
                sda_vricms,
                sda_quantidade,
                sda_troco,
                sda_desconto,
                sda_liquido,
                ven_numero,
                sda_operacao,
                sda_obs,
                sda_sistema,
                sda_numerosessao
            )
            SELECT
                :ID,
                ven.cli_codigo,
                ven.ven_cpfcnpj,
                ven.ven_nomecli,
                ven.ven_endcli,
                1,
                :P_LOJA_CODIGO,
                :P_USUARIO,
                IIF(:P_TERMINAL > 0, :P_TERMINAL, NULL),
                CURRENT_DATE,
                CURRENT_TIME,
                :CPL_VALOR214,
                COALESCE(ven.ven_serie, 1),
                CASE
                    WHEN COALESCE(ven.ven_serie, 0) > 1 THEN ven.ven_numorg
                    ELSE NULL
                END,
                :P_ESPECIE_DOC,
                '0',
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                :P_VEN_NUMERO,
                'D',
                CASE
                    WHEN :CPL_PERFIL181 = 'S' THEN
                        IIF(
                            ven.ven_obs IS NOT NULL,
                            ven.ven_obs || '-' ||
                            (
                                SELECT LIST(COALESCE(pro.pro_titulons, ' ') || '-' || ivd.ivd_infadicionais)
                                  FROM itensven ivd
                                  JOIN produtos pro
                                    ON pro.pro_codigo = ivd.pro_codigo
                                WHERE ivd.ven_numero = :P_VEN_NUMERO
                                  AND ivd.ivd_infadicionais IS NOT NULL
                                  AND pro.pro_ns = 'S'
                            ),
                            (
                                SELECT LIST(COALESCE(pro.pro_titulons, ' ') || '-' || ivd.ivd_infadicionais)
                                  FROM itensven ivd
                                  JOIN produtos pro
                                    ON pro.pro_codigo = ivd.pro_codigo
                                WHERE ivd.ven_numero = :P_VEN_NUMERO
                                  AND ivd.ivd_infadicionais IS NOT NULL
                                  AND pro.pro_ns = 'S'
                            )
                        )
                    ELSE
                        IIF(
                            ven.ven_obs IS NOT NULL,
                            ven.ven_obs || '-' ||
                            (
                                SELECT LIST('-' || ivd.ivd_infadicionais)
                                  FROM itensven ivd
                                WHERE ivd.ven_numero = :P_VEN_NUMERO
                                  AND ivd.ivd_infadicionais IS NOT NULL
                            ),
                            (
                                SELECT LIST('-' || ivd.ivd_infadicionais)
                                  FROM itensven ivd
                                WHERE ivd.ven_numero = :P_VEN_NUMERO
                                  AND ivd.ivd_infadicionais IS NOT NULL
                            )
                        )
                END,
                COALESCE(ven.ven_sistema, 'N'),
                :P_NUM_SESSAO
            FROM vendas ven
            WHERE ven.ven_numero = :P_VEN_NUMERO;

            INSERT INTO itens_sda
            (
                sda_numero,
                isa_numero,
                isa_item,
                pro_codigo,
                isa_qtde,
                isa_preco,
                isa_total,
                isa_percicms,
                naf_cfop,
                icm_codigo,
                isa_perc_red_icms,
                cof_codigo,
                pis_codigo,
                cnr_codigo,
                isa_cancelado,
                isa_sit_trib,
                isa_prccompra,
                isa_prccusto,
                isa_liquido,
                isa_desconto,
                isa_acrescimo,
                isa_percdesc,
                isa_percacresc,
                isa_serial,
                cis_codigo,
                cct_codigo,
                cic_codigo,
                isa_percibsuf,
                isa_percibsmun,
                isa_perccbs,
                isa_redaliqufibs,
                isa_redaliqmunibs,
                isa_redaliqcbs,
                isa_adremibs,
                isa_adremcbs,
                isa_adremibsreten,
                isa_adremcbsreten,
                isa_adremibsret,
                isa_adremcbsret,
                isa_percis,
                isa_percisespec,
                isa_prccustoger
            )
            SELECT
                :ID,
                GEN_ID(gen_numeroisa, 1),
                ivd.ivd_item,
                ivd.pro_codigo,

                CASE
                    WHEN pro.pro_estoque = 'N' THEN ivd.ivd_qtde
                    ELSE (
                        SELECT CASE
                                  WHEN COALESCE(e.est_apoio, 0) >= ivd.ivd_qtde THEN ivd.ivd_qtde
                                  WHEN COALESCE(e.est_apoio, 0) > 0 AND COALESCE(e.est_apoio, 0) < ivd.ivd_qtde THEN e.est_apoio
                                  ELSE 0
                              END
                          FROM estoque e
                        WHERE e.pro_codigo = ivd.pro_codigo
                          AND e.loj_codigo = :P_LOJA_CODIGO
                    )
                END,

                CASE
                    WHEN :CPL_PERFIL227 IN ('1', '2') THEN
                        CAST(
                            ivd.ivd_preco +
                            IIF(:VEN_TOTALSEG > 0,
                                ((((ivd.ivd_liquido / (:VEN_TOTALLIQUIDO - :VEN_TOTALSEG)) * 100) * :VEN_TOTALSEG) / 100),
                                0)
                        AS NUMERIC(15,2))
                    ELSE
                        IIF(
                            COALESCE(ivd.ivd_prcfiscal, 0) > 0,
                            ivd.ivd_prcfiscal,
                            CAST(
                                ivd.ivd_preco +
                                IIF(:VEN_TOTALSEG > 0,
                                    ((((ivd.ivd_liquido / (:VEN_TOTALLIQUIDO - :VEN_TOTALSEG)) * 100) * :VEN_TOTALSEG) / 100),
                                    0)
                            AS NUMERIC(15,2))
                        )
                END,

                (
                    CASE
                        WHEN :CPL_PERFIL227 IN ('1', '2') THEN
                            CAST(
                                ivd.ivd_preco +
                                IIF(:VEN_TOTALSEG > 0,
                                    ((((ivd.ivd_liquido / (:VEN_TOTALLIQUIDO - :VEN_TOTALSEG)) * 100) * :VEN_TOTALSEG) / 100),
                                    0)
                            AS NUMERIC(15,4))
                        ELSE
                            IIF(
                                COALESCE(ivd.ivd_prcfiscal, 0) > 0,
                                ivd.ivd_prcfiscal,
                                CAST(
                                    ivd.ivd_preco +
                                    IIF(:VEN_TOTALSEG > 0,
                                        ((((ivd.ivd_liquido / (:VEN_TOTALLIQUIDO - :VEN_TOTALSEG)) * 100) * :VEN_TOTALSEG) / 100),
                                        0)
                                AS NUMERIC(15,2))
                            )
                    END
                    *
                    CASE
                        WHEN pro.pro_estoque = 'N' THEN ivd.ivd_qtde
                        ELSE (
                            SELECT CASE
                                      WHEN COALESCE(e.est_apoio, 0) >= ivd.ivd_qtde THEN ivd.ivd_qtde
                                      WHEN COALESCE(e.est_apoio, 0) > 0 AND COALESCE(e.est_apoio, 0) < ivd.ivd_qtde THEN e.est_apoio
                                      ELSE 0
                                  END
                              FROM estoque e
                            WHERE e.pro_codigo = ivd.pro_codigo
                              AND e.loj_codigo = :P_LOJA_CODIGO
                        )
                    END
                ),

                CASE
                    WHEN (:VEN_SISTEMA = 'S') AND (est.pro_imposto NOT IN ('I', 'S', 'N')) THEN 6.22
                    WHEN est.pro_imposto IN ('I', 'S', 'N') THEN 0
                    ELSE (SELECT percicms FROM aliquotas_icms(COALESCE(est.pro_imposto, 'E')))
                END,

                COALESCE(est.naf_cfop, 5102),
                IIF(COALESCE(pro.pro_reducaoicms, 0) > 0, 0, COALESCE(est.icm_codigo, 0)),
                0,
                COALESCE(est.cof_codigo, 49),
                COALESCE(est.pis_codigo, 49),
                est.cnr_codigo,
                COALESCE(ivd.ivd_cancelado, 'N'),
                COALESCE(est.pro_imposto, '1'),
                COALESCE(ivd.ivd_prccompra, 0),
                COALESCE(ivd.ivd_prccusto, 0),

                TRUNC(
                    CAST(
                        CASE
                            WHEN (:CPL_PERFIL227 = '1') AND (COALESCE(ivd.ivd_desconto, 0) > 0) THEN
                                CAST(
                                    (
                                        ivd.ivd_liquido +
                                        IIF(:VEN_TOTALSEG > 0,
                                            ((((ivd.ivd_liquido / (:VEN_TOTALLIQUIDO - :VEN_TOTALSEG)) * 100) * :VEN_TOTALSEG) / 100),
                                            0)
                                    ) / ivd.ivd_qtde
                                AS NUMERIC(18,2))
                                *
                                CASE
                                    WHEN pro.pro_estoque = 'N' THEN ivd.ivd_qtde
                                    ELSE (
                                        SELECT CASE
                                                  WHEN COALESCE(e.est_apoio, 0) >= ivd.ivd_qtde THEN ivd.ivd_qtde
                                                  WHEN COALESCE(e.est_apoio, 0) > 0 AND COALESCE(e.est_apoio, 0) < ivd.ivd_qtde THEN e.est_apoio
                                                  ELSE 0
                                              END
                                          FROM estoque e
                                        WHERE e.pro_codigo = ivd.pro_codigo
                                          AND e.loj_codigo = :P_LOJA_CODIGO
                                    )
                                END

                            WHEN (:CPL_PERFIL227 = '1') AND (:PERCDESC > 0) THEN
                                CAST(
                                    (
                                        (
                                            ivd.ivd_preco +
                                            IIF(:VEN_TOTALSEG > 0,
                                                ((((ivd.ivd_liquido / (:VEN_TOTALLIQUIDO - :VEN_TOTALSEG)) * 100) * :VEN_TOTALSEG) / 100),
                                                0)
                                        ) *
                                        CASE
                                            WHEN pro.pro_estoque = 'N' THEN ivd.ivd_qtde
                                            ELSE (
                                                SELECT CASE
                                                          WHEN COALESCE(e.est_apoio, 0) >= ivd.ivd_qtde THEN ivd.ivd_qtde
                                                          WHEN COALESCE(e.est_apoio, 0) > 0 AND COALESCE(e.est_apoio, 0) < ivd.ivd_qtde THEN e.est_apoio
                                                          ELSE 0
                                                      END
                                                  FROM estoque e
                                                WHERE e.pro_codigo = ivd.pro_codigo
                                                  AND e.loj_codigo = :P_LOJA_CODIGO
                                            )
                                        END
                                    )
                                    -
                                    (
                                        (CAST(:PERCDESC / 100 AS NUMERIC(15,5))) *
                                        (
                                            ivd.ivd_preco *
                                            CASE
                                                WHEN pro.pro_estoque = 'N' THEN ivd.ivd_qtde
                                                ELSE (
                                                    SELECT CASE
                                                              WHEN COALESCE(e.est_apoio, 0) >= ivd.ivd_qtde THEN ivd.ivd_qtde
                                                              WHEN COALESCE(e.est_apoio, 0) > 0 AND COALESCE(e.est_apoio, 0) < ivd.ivd_qtde THEN e.est_apoio
                                                              ELSE 0
                                                          END
                                                      FROM estoque e
                                                    WHERE e.pro_codigo = ivd.pro_codigo
                                                      AND e.loj_codigo = :P_LOJA_CODIGO
                                                )
                                            END
                                        )
                                    )
                                AS NUMERIC(18,2))

                            WHEN (:CPL_PERFIL227 = '1') THEN
                                (
                                    ivd.ivd_preco +
                                    IIF(:VEN_TOTALSEG > 0,
                                        ((((ivd.ivd_liquido / (:VEN_TOTALLIQUIDO - :VEN_TOTALSEG)) * 100) * :VEN_TOTALSEG) / 100),
                                        0)
                                ) *
                                CASE
                                    WHEN pro.pro_estoque = 'N' THEN ivd.ivd_qtde
                                    ELSE (
                                        SELECT CASE
                                                  WHEN COALESCE(e.est_apoio, 0) >= ivd.ivd_qtde THEN ivd.ivd_qtde
                                                  WHEN COALESCE(e.est_apoio, 0) > 0 AND COALESCE(e.est_apoio, 0) < ivd.ivd_qtde THEN e.est_apoio
                                                  ELSE 0
                                              END
                                          FROM estoque e
                                        WHERE e.pro_codigo = ivd.pro_codigo
                                          AND e.loj_codigo = :P_LOJA_CODIGO
                                    )
                                END

                            WHEN (:CPL_PERFIL227 = '2') THEN
                                (
                                    ivd.ivd_preco +
                                    IIF(:VEN_TOTALSEG > 0,
                                        ((((ivd.ivd_liquido / (:VEN_TOTALLIQUIDO - :VEN_TOTALSEG)) * 100) * :VEN_TOTALSEG) / 100),
                                        0)
                                ) *
                                CASE
                                    WHEN pro.pro_estoque = 'N' THEN ivd.ivd_qtde
                                    ELSE (
                                        SELECT CASE
                                                  WHEN COALESCE(e.est_apoio, 0) >= ivd.ivd_qtde THEN ivd.ivd_qtde
                                                  WHEN COALESCE(e.est_apoio, 0) > 0 AND COALESCE(e.est_apoio, 0) < ivd.ivd_qtde THEN e.est_apoio
                                                  ELSE 0
                                              END
                                          FROM estoque e
                                        WHERE e.pro_codigo = ivd.pro_codigo
                                          AND e.loj_codigo = :P_LOJA_CODIGO
                                    )
                                END

                            ELSE
                                IIF(
                                    COALESCE(ivd.ivd_prcfiscal, 0) > 0,
                                    (
                                        ivd.ivd_prcfiscal +
                                        IIF(:VEN_TOTALSEG > 0,
                                            ((((ivd.ivd_liquido / (:VEN_TOTALLIQUIDO - :VEN_TOTALSEG)) * 100) * :VEN_TOTALSEG) / 100),
                                            0)
                                    ),
                                    (
                                        ivd.ivd_preco +
                                        IIF(:VEN_TOTALSEG > 0,
                                            ((((ivd.ivd_liquido / (:VEN_TOTALLIQUIDO - :VEN_TOTALSEG)) * 100) * :VEN_TOTALSEG) / 100),
                                            0)
                                    )
                                ) *
                                CASE
                                    WHEN pro.pro_estoque = 'N' THEN ivd.ivd_qtde
                                    ELSE (
                                        SELECT CASE
                                                  WHEN COALESCE(e.est_apoio, 0) >= ivd.ivd_qtde THEN ivd.ivd_qtde
                                                  WHEN COALESCE(e.est_apoio, 0) > 0 AND COALESCE(e.est_apoio, 0) < ivd.ivd_qtde THEN e.est_apoio
                                                  ELSE 0
                                              END
                                          FROM estoque e
                                        WHERE e.pro_codigo = ivd.pro_codigo
                                          AND e.loj_codigo = :P_LOJA_CODIGO
                                    )
                                END
                        END
                    AS NUMERIC(15,2)), 2),

                CASE
                    WHEN (:CPL_PERFIL227 = '1') AND (COALESCE(ivd.ivd_desconto, 0) > 0) THEN
                        CAST(
                            ivd.ivd_desconto /
                            CASE
                                WHEN pro.pro_estoque = 'N' THEN ivd.ivd_qtde
                                ELSE ivd.ivd_qtde
                            END
                        AS NUMERIC(18,2))
                        *
                        CASE
                            WHEN pro.pro_estoque = 'N' THEN ivd.ivd_qtde
                            ELSE (
                                SELECT CASE
                                          WHEN COALESCE(e.est_apoio, 0) >= ivd.ivd_qtde THEN ivd.ivd_qtde
                                          WHEN COALESCE(e.est_apoio, 0) > 0 AND COALESCE(e.est_apoio, 0) < ivd.ivd_qtde THEN e.est_apoio
                                          ELSE 0
                                      END
                                  FROM estoque e
                                WHERE e.pro_codigo = ivd.pro_codigo
                                  AND e.loj_codigo = :P_LOJA_CODIGO
                            )
                        END

                    WHEN (:PERCDESC > 0) AND (:CPL_PERFIL227 = '1') THEN
                        CAST(
                            (CAST(:PERCDESC / 100 AS NUMERIC(15,5))) *
                            (
                                ivd.ivd_preco *
                                CASE
                                    WHEN pro.pro_estoque = 'N' THEN ivd.ivd_qtde
                                    ELSE (
                                        SELECT CASE
                                                  WHEN COALESCE(e.est_apoio, 0) >= ivd.ivd_qtde THEN ivd.ivd_qtde
                                                  WHEN COALESCE(e.est_apoio, 0) > 0 AND COALESCE(e.est_apoio, 0) < ivd.ivd_qtde THEN e.est_apoio
                                                  ELSE 0
                                              END
                                          FROM estoque e
                                        WHERE e.pro_codigo = ivd.pro_codigo
                                          AND e.loj_codigo = :P_LOJA_CODIGO
                                    )
                                END
                            )
                        AS NUMERIC(18,2))

                    ELSE 0
                END,

                0,

                CASE
                    WHEN (:CPL_PERFIL227 = '1') AND (COALESCE(ivd.ivd_desconto, 0) > 0) THEN COALESCE(ivd.ivd_percdesconto, 0)
                    WHEN (:CPL_PERFIL227 = '1') AND (:PERCDESC > 0) THEN :PERCDESC
                    ELSE 0
                END,

                0,
                SUBSTRING(ivd.ivd_infadicionais FROM 1 FOR 35),
                est.cis_codigo,
                est.cct_codigo,
                cct.cic_codigo,
                est.est_percibsuf,
                est.est_percibsmun,
                est.est_perccbs,
                COALESCE(cct.cct_percredibs, 0),
                COALESCE(cct.cct_percredibs, 0),
                COALESCE(cct.cct_percredcbs, 0),
                est.est_adremibs,
                est.est_adremcbs,
                est.est_adremibsreten,
                est.est_adremcbsreten,
                est.est_adremibsret,
                est.est_adremcbsret,
                est.est_percis,
                est.est_percisespec,
                COALESCE(pro.pro_prccusto, 0)
            FROM itensven ivd
            INNER JOIN produtos pro
                    ON pro.pro_codigo = ivd.pro_codigo
            INNER JOIN estoque est
                    ON est.pro_codigo = ivd.pro_codigo
                  AND est.loj_codigo = :P_LOJA_CODIGO
            INNER JOIN lojas loj
                    ON loj.loj_codigo = est.loj_codigo
            LEFT JOIN codigosclassiftributaria_ibscbs cct
                  ON cct.cct_codigo = est.cct_codigo
            WHERE
                (
                    (
                        pro.pro_estoque = 'N'
                        AND ivd.ven_numero = :P_VEN_NUMERO
                        AND ivd.ivd_liquido > 0
                        AND ivd.ivd_operacao = 'V'
                        AND est.pro_emitefisco = 'S'
                        AND ivd.ivd_tipo = 'F'
                        AND (:P_LOJ_PERFIL427 <> 'N' OR ivd.loj_codigo = :P_LOJA_CODIGO)
                    )
                    OR
                    (
                        ivd.ven_numero = :P_VEN_NUMERO
                        AND ivd.ivd_liquido > 0
                        AND ivd.ivd_operacao = 'V'
                        AND COALESCE(est.pro_emitefisco, 'S') = 'S'
                        AND ivd.ivd_tipo = 'F'
                        AND (:P_LOJ_PERFIL427 <> 'N' OR ivd.loj_codigo = :P_LOJA_CODIGO)
                        AND
                        (
                            SELECT CASE
                                      WHEN COALESCE(e.est_apoio, 0) >= ivd.ivd_qtde THEN ivd.ivd_qtde
                                      WHEN COALESCE(e.est_apoio, 0) > 0 AND COALESCE(e.est_apoio, 0) < ivd.ivd_qtde THEN e.est_apoio
                                      ELSE 0
                                  END
                              FROM estoque e
                            WHERE e.pro_codigo = ivd.pro_codigo
                              AND e.loj_codigo = :P_LOJA_CODIGO
                        ) > 0
                    )
                )
            ORDER BY ivd.ven_numero, ivd.ivd_item;

            DELETE FROM itens_sda isa
            WHERE isa.sda_numero = :ID
              AND COALESCE(isa.isa_qtde, 0) <= 0;

            UPDATE itens_sda
              SET isa_vrtotalitem = isa_liquido + isa_vribsuf + isa_vribsmun + isa_vrcbs
            WHERE sda_numero = :ID;

            UPDATE saidas_apoio sda
              SET
                  sda.sda_totalitenssda =
                      (SELECT SUM(isa.isa_vrtotalitem)
                          FROM itens_sda isa
                        WHERE isa.sda_numero = :ID),
                  sda.sda_percdesc =
                      CASE
                          WHEN COALESCE(
                              (SELECT SUM(isa.isa_desconto)
                                  FROM itens_sda isa
                                WHERE isa.sda_numero = :ID), 0) = 0
                          THEN 0.00
                          ELSE
                              (
                                  (SELECT SUM(isa.isa_desconto)
                                      FROM itens_sda isa
                                    WHERE isa.sda_numero = :ID)
                                  /
                                  (SELECT SUM(isa.isa_total)
                                      FROM itens_sda isa
                                    WHERE isa.sda_numero = :ID)
                              ) * 100.00
                      END
            WHERE sda.sda_numero = :ID;

            UPDATE saidas_apoio sda
              SET sda.sda_desconto =
                      (SELECT SUM(COALESCE(isa.isa_desconto, 0))
                          FROM itens_sda isa
                        WHERE isa.sda_numero = :ID),
                  sda.sda_liquido =
                      sda.sda_total -
                      (SELECT SUM(COALESCE(isa.isa_desconto, 0))
                          FROM itens_sda isa
                        WHERE isa.sda_numero = :ID)
            WHERE sda.sda_numero = :ID;

            IF (:CPL_PERFIL104 = 'S') THEN
            BEGIN
                DELETE FROM financeirosda sda
                WHERE sda.sda_numero = :ID;

                INSERT INTO financeirosda
                (
                    sda_numero,
                    fin_numero,
                    fin_nsu,
                    plp_codigo,
                    fpg_codigo,
                    fin_valorfpg,
                    fin_valorpago,
                    fin_status
                )
                SELECT
                    :ID,
                    GEN_ID(gen_numerofsd, 1),
                    SUBSTRING(ven.ven_nsu1 FROM 1 FOR 40),
                    ven.pp1_codigo,
                    ven.fp1_codigo,
                    :VALOR1,
                    :VALOR1,
                    'S'
                FROM vendas ven
                WHERE ven.ven_numero = :P_VEN_NUMERO
                  AND COALESCE(ven.ven_totalpp1, 0) > 0;

                INSERT INTO financeirosda
                (
                    sda_numero,
                    fin_numero,
                    fin_nsu,
                    plp_codigo,
                    fpg_codigo,
                    fin_valorfpg,
                    fin_valorpago,
                    fin_status
                )
                SELECT
                    :ID,
                    GEN_ID(gen_numerofsd, 1),
                    SUBSTRING(ven.ven_nsu2 FROM 1 FOR 40),
                    ven.pp2_codigo,
                    ven.fp2_codigo,
                    :VALOR2,
                    :VALOR2,
                    'S'
                FROM vendas ven
                WHERE ven.ven_numero = :P_VEN_NUMERO
                  AND COALESCE(ven.ven_totalpp2, 0) > 0;

                INSERT INTO financeirosda
                (
                    sda_numero,
                    fin_numero,
                    fin_nsu,
                    plp_codigo,
                    fpg_codigo,
                    fin_valorfpg,
                    fin_valorpago,
                    fin_status
                )
                SELECT
                    :ID,
                    GEN_ID(gen_numerofsd, 1),
                    SUBSTRING(ven.ven_nsu3 FROM 1 FOR 40),
                    ven.pp3_codigo,
                    ven.fp3_codigo,
                    :VALOR3,
                    :VALOR3,
                    'S'
                FROM vendas ven
                WHERE ven.ven_numero = :P_VEN_NUMERO
                  AND COALESCE(ven.ven_totalpp3, 0) > 0;

                INSERT INTO financeirosda
                (
                    sda_numero,
                    fin_numero,
                    fin_nsu,
                    plp_codigo,
                    fpg_codigo,
                    fin_valorfpg,
                    fin_valorpago,
                    fin_status
                )
                SELECT
                    :ID,
                    GEN_ID(gen_numerofsd, 1),
                    SUBSTRING(ven.ven_nsu4 FROM 1 FOR 40),
                    ven.pp4_codigo,
                    ven.fp4_codigo,
                    :VALOR4,
                    :VALOR4,
                    'S'
                FROM vendas ven
                WHERE ven.ven_numero = :P_VEN_NUMERO
                  AND COALESCE(ven.ven_totalpp4, 0) > 0;
            END

            SELECT COUNT(1)
              FROM itens_sda isa
            WHERE isa.sda_numero = :ID
              INTO :ISA_QDTREG;

            IF (:ISA_QDTREG > 0) THEN
            BEGIN
                UPDATE vendas ven
                  SET ven.sda_numero = :ID
                WHERE ven.ven_numero = :P_VEN_NUMERO;
            END
            ELSE
            BEGIN
                DELETE FROM saidas_apoio
                WHERE sda_numero = :ID;

                ID = 0;
            END

            SUSPEND;
        END
        ELSE
        BEGIN
            ID = 0;
        END
    END`;

    const result = await new Promise((resolve, reject) => {
      transaction.query(query, params, (err: any, res: any) => {
        if (err) return reject(err);
        resolve(res[0]);
      });
    });

    return result;
  }
}
