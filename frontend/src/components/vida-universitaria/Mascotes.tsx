import React from 'react';
import Svg, { G, Path, Circle, Ellipse, Rect, Text as SvgText, Line } from 'react-native-svg';

/**
 * Mascotes do UnBook em estilo "adesivo" (borda branca recortada + contorno marrom).
 *
 * - Migalha: o pombo do ICC. Cansado, sempre com um pão do RU.
 * - Paçoca: o cachorro do campus. Animado, guia dos calouros.
 *
 * Cada parte é desenhada em 3 camadas: sombra, borda branca do adesivo e arte final.
 */

const CONTORNO = '#4A2C2A';

type Camada = 'sombra' | 'borda' | 'arte';

function estilo(camada: Camada, fill: string, contorno = true) {
  if (camada === 'sombra') {
    return { fill: '#1F1F1F', stroke: '#1F1F1F', strokeWidth: 16, strokeLinejoin: 'round' as const, opacity: 0.14 };
  }
  if (camada === 'borda') {
    return { fill: '#FFFFFF', stroke: '#FFFFFF', strokeWidth: 16, strokeLinejoin: 'round' as const };
  }
  return contorno
    ? { fill, stroke: CONTORNO, strokeWidth: 3.5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const }
    : { fill };
}

function Adesivo({
  size,
  render,
}: {
  size: number;
  render: (c: Camada) => React.ReactNode;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <G transform="translate(2 5)">{render('sombra')}</G>
      <G>{render('borda')}</G>
      <G>{render('arte')}</G>
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/* Migalha — o pombo do ICC                                            */
/* ------------------------------------------------------------------ */

export type PoseMigalha = 'pao' | 'cafe' | 'dormindo' | 'placa' | 'professor';

interface MigalhaProps {
  size?: number;
  pose?: PoseMigalha;
  textoPlaca?: string;
}

export function Migalha({ size = 160, pose = 'pao', textoPlaca = 'SIGAA\nFORA DO AR' }: MigalhaProps) {
  const dormindo = pose === 'dormindo';

  const render = (c: Camada) => {
    const arte = c === 'arte';
    return (
      <>
        {/* Caderno (pose dormindo) */}
        {dormindo && (
          <Path d="M28 168 L100 158 L172 168 L172 182 L100 174 L28 182 Z" {...estilo(c, '#FFFFFF')} />
        )}
        {dormindo && arte && (
          <>
            <Line x1="100" y1="158" x2="100" y2="174" stroke={CONTORNO} strokeWidth={2.5} />
            <Path d="M40 168 L90 162 M40 174 L90 168 M110 162 L160 168 M110 168 L160 174" stroke="#9BB7D4" strokeWidth={1.5} />
          </>
        )}

        {/* Cauda */}
        <Path
          d={dormindo ? 'M150 150 L190 152 L186 164 L146 162 Z' : 'M148 140 L188 160 L180 171 L138 155 Z'}
          {...estilo(c, '#8090AE')}
        />

        {/* Corpo */}
        <Ellipse
          cx={dormindo ? 112 : 118}
          cy={dormindo ? 145 : 128}
          rx={dormindo ? 56 : 46}
          ry={dormindo ? 24 : 44}
          {...estilo(c, '#C9CEDB')}
        />

        {/* Patas */}
        {!dormindo && (
          <G>
            <Path d="M108 168 L106 186 M106 186 L97 190 M106 186 L106 192 M106 186 L114 190" {...(c === 'arte' ? { stroke: '#E2A04A', strokeWidth: 4.5, strokeLinecap: 'round' as const, fill: 'none' } : { stroke: c === 'borda' ? '#FFFFFF' : '#1F1F1F', strokeWidth: 16, strokeLinecap: 'round' as const, fill: 'none', opacity: c === 'sombra' ? 0.14 : 1 })} />
            <Path d="M128 168 L130 186 M130 186 L121 190 M130 186 L131 192 M130 186 L139 190" {...(c === 'arte' ? { stroke: '#E2A04A', strokeWidth: 4.5, strokeLinecap: 'round' as const, fill: 'none' } : { stroke: c === 'borda' ? '#FFFFFF' : '#1F1F1F', strokeWidth: 16, strokeLinecap: 'round' as const, fill: 'none', opacity: c === 'sombra' ? 0.14 : 1 })} />
          </G>
        )}

        {/* Asa */}
        <Path
          d={
            dormindo
              ? 'M110 130 C 140 122, 172 132, 168 150 C 150 160, 120 156, 110 130 Z'
              : 'M112 104 C 146 96, 172 124, 164 152 C 142 162, 112 146, 112 104 Z'
          }
          {...estilo(c, '#DCDFE8')}
        />
        {arte && !dormindo && (
          <Path
            d="M126 122 Q140 118 150 128 M128 136 Q144 132 156 142"
            stroke="#6E7891"
            strokeWidth={4}
            strokeLinecap="round"
            fill="none"
          />
        )}
        {arte && dormindo && (
          <Path d="M126 138 Q142 134 156 142" stroke="#6E7891" strokeWidth={4} strokeLinecap="round" fill="none" />
        )}

        {/* Peito "w" */}
        {arte && !dormindo && (
          <Path d="M98 142 q3 5 6 0 q3 5 6 0" stroke={CONTORNO} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        )}

        {/* Pão do RU */}
        {pose === 'pao' && (
          <G>
            <Path d="M14 98 C 8 76, 30 68, 44 74 C 58 62, 84 70, 80 92 L 78 152 Q 78 160 70 160 L 26 160 Q 18 160 18 152 Z" {...estilo(c, '#D9A55B')} transform="translate(4 6)" />
            <Path d="M14 98 C 8 76, 30 68, 44 74 C 58 62, 84 70, 80 92 L 78 152 Q 78 160 70 160 L 26 160 Q 18 160 18 152 Z" {...estilo(c, '#F5D592')} />
            {arte && (
              <G fill="#E1B163">
                <Circle cx="36" cy="104" r="2.5" />
                <Circle cx="58" cy="118" r="2.5" />
                <Circle cx="40" cy="134" r="2.5" />
                <Circle cx="64" cy="140" r="2" />
                <Circle cx="30" cy="148" r="2" />
              </G>
            )}
          </G>
        )}

        {/* Café */}
        {pose === 'cafe' && (
          <G>
            <Path d="M30 112 L74 112 L68 168 Q67 174 61 174 L43 174 Q37 174 36 168 Z" {...estilo(c, '#FFFFFF')} />
            <Rect x="26" y="102" width="52" height="12" rx="4" {...estilo(c, '#3B2A22')} />
            <Rect x="34" y="128" width="36" height="22" rx="3" {...estilo(c, '#B07A4F')} />
            {arte && (
              <Path d="M44 92 q4 -6 0 -12 M56 92 q4 -6 0 -12" stroke="#9A9A9A" strokeWidth={2.5} fill="none" strokeLinecap="round" />
            )}
          </G>
        )}

        {/* Placa */}
        {pose === 'placa' && (
          <G>
            <Rect x="4" y="88" width="96" height="62" rx="6" {...estilo(c, '#E8C79A')} />
            {arte &&
              textoPlaca.split('\n').map((linha, i, arr) => (
                <SvgText
                  key={i}
                  x="52"
                  y={122 - (arr.length - 1) * 9 + i * 18}
                  fontSize="14"
                  fontWeight="900"
                  fill="#3B2A22"
                  textAnchor="middle"
                >
                  {linha}
                </SvgText>
              ))}
          </G>
        )}

        {/* Professor: Ponteiro de madeira apontando para a lousa e gravatinha */}
        {pose === 'professor' && (
          <G>
            {/* Régua / Ponteiro de madeira apontando para trás e para cima */}
            <Path
              d="M 94 122 L 18 20 L 26 14 L 100 116 Z"
              {...estilo(c, '#C49B71')}
            />
            {arte && (
              <>
                {/* Ponta em destaque do ponteiro */}
                <Path d="M 18 20 L 26 14 L 21 8 L 13 14 Z" fill="#FE4141" stroke={CONTORNO} strokeWidth={2} />
                <Line x1="32" y1="32" x2="88" y2="108" stroke="#8D5B36" strokeWidth={1.5} />
              </>
            )}

            {/* Gravatinha borboleta de professor */}
            <Path
              d="M 86 134 L 98 140 L 86 146 Z M 110 134 L 98 140 L 110 146 Z"
              {...estilo(c, '#FE4141')}
            />
            {arte && (
              <Circle cx="98" cy="140" r="4" fill="#FE4141" stroke={CONTORNO} strokeWidth={2} />
            )}
          </G>
        )}

        {/* Cabeça + pescoço */}
        <Path
          d={
            dormindo
              ? 'M50 150 C 40 120, 64 104, 86 110 C 104 116, 108 138, 104 156 Z'
              : 'M74 96 C 62 54, 92 34, 114 42 C 134 50, 134 80, 126 104 L 84 112 Z'
          }
          {...estilo(c, '#8195B4')}
        />

        {/* Bico */}
        <Path
          d={dormindo ? 'M52 138 Q38 146 44 154 Q52 150 58 146 Z' : 'M78 62 Q60 66 64 76 Q72 74 82 72 Z'}
          {...estilo(c, '#5E6474')}
        />

        {/* Olho */}
        {arte && !dormindo && (
          <G>
            <Circle cx="104" cy="64" r="12" fill="#FFFFFF" stroke={CONTORNO} strokeWidth={3} />
            <Circle cx="104" cy="65" r="7" fill="#4A2C2A" />
            <Circle cx="102" cy="63" r="2.2" fill="#FFFFFF" />
            {/* Pálpebra pesada (olhar de quem dormiu 4h) */}
            {pose !== 'pao' && pose !== 'professor' && (
              <Path d="M91 62 A13 13 0 0 1 117 62 Z" fill="#8195B4" stroke={CONTORNO} strokeWidth={3} />
            )}
            {/* Óculos de professor redondinho com haste e brilho de lente */}
            {pose === 'professor' && (
              <G>
                <Circle cx="104" cy="64" r="15" fill="none" stroke="#1F1F1F" strokeWidth={3.5} />
                <Path d="M 89 64 Q 82 61 77 65" stroke="#1F1F1F" strokeWidth={3} fill="none" strokeLinecap="round" />
                <Path d="M 119 64 Q 126 62 131 65" stroke="#1F1F1F" strokeWidth={3} fill="none" strokeLinecap="round" />
                <Path d="M 97 56 L 102 51" stroke="#FFFFFF" strokeWidth={2.5} strokeLinecap="round" />
              </G>
            )}
            {/* Olheira */}
            <Path d="M94 79 Q104 85 114 79" stroke="#6B5B95" strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.75} />
          </G>
        )}
        {arte && dormindo && (
          <Path d="M70 128 Q78 134 86 128" stroke={CONTORNO} strokeWidth={3} fill="none" strokeLinecap="round" />
        )}
      </>
    );
  };

  return <Adesivo size={size} render={render} />;
}

/* ------------------------------------------------------------------ */
/* Paçoca — o cachorro do campus                                       */
/* ------------------------------------------------------------------ */

export type PosePacoca = 'sentado' | 'lapis' | 'osso' | 'ticket' | 'livros';

interface PacocaProps {
  size?: number;
  pose?: PosePacoca;
}

const MARROM = '#7A5236';
const MARROM_ESCURO = '#5A3A24';
const FOCINHO = '#A0714E';

export function Pacoca({ size = 160, pose = 'sentado' }: PacocaProps) {
  const bandana = pose !== 'sentado';

  const render = (c: Camada) => {
    const arte = c === 'arte';
    return (
      <>
        {/* Livros ao lado */}
        {pose === 'livros' && (
          <G>
            <Rect x="138" y="158" width="56" height="16" rx="3" {...estilo(c, '#1349EB')} />
            <Rect x="142" y="142" width="50" height="16" rx="3" {...estilo(c, '#F1C321')} />
            <Rect x="136" y="126" width="54" height="16" rx="3" {...estilo(c, '#009A5E')} />
            {arte && (
              <SvgText x="163" y="138" fontSize="9" fontWeight="900" fill="#FFFFFF" textAnchor="middle">
                CÁLCULO 1
              </SvgText>
            )}
          </G>
        )}

        {/* Rabo */}
        <Path
          d="M138 150 C 168 146, 176 116, 164 100"
          fill="none"
          stroke={c === 'arte' ? CONTORNO : c === 'borda' ? '#FFFFFF' : '#1F1F1F'}
          strokeWidth={c === 'arte' ? 17 : 30}
          strokeLinecap="round"
          opacity={c === 'sombra' ? 0.14 : 1}
        />
        {arte && (
          <Path d="M138 150 C 168 146, 176 116, 164 100" fill="none" stroke={MARROM} strokeWidth={10} strokeLinecap="round" />
        )}

        {/* Corpo */}
        <Path d="M60 182 C 52 142, 70 112, 100 112 C 130 112, 148 142, 140 182 Z" {...estilo(c, MARROM)} />

        {/* Patas da frente */}
        <Rect x="76" y="150" width="20" height="38" rx="10" {...estilo(c, MARROM)} />
        <Rect x="104" y="150" width="20" height="38" rx="10" {...estilo(c, MARROM)} />
        {arte && (
          <Path d="M82 184 L82 180 M90 184 L90 180 M110 184 L110 180 M118 184 L118 180" stroke={CONTORNO} strokeWidth={2} strokeLinecap="round" />
        )}

        {/* Osso */}
        {pose === 'osso' && (
          <G transform="rotate(-14 100 186)">
            <Rect x="60" y="180" width="80" height="12" rx="6" {...estilo(c, '#F6EBD3')} />
            <Circle cx="60" cy="180" r="8" {...estilo(c, '#F6EBD3')} />
            <Circle cx="60" cy="192" r="8" {...estilo(c, '#F6EBD3')} />
            <Circle cx="140" cy="180" r="8" {...estilo(c, '#F6EBD3')} />
            <Circle cx="140" cy="192" r="8" {...estilo(c, '#F6EBD3')} />
            {arte && <Rect x="60" y="181" width="80" height="10" fill="#F6EBD3" />}
          </G>
        )}

        {/* Bandana verde UnB */}
        {bandana && (
          <Path d="M66 106 Q100 118 134 106 L104 146 Q100 150 96 146 Z" {...estilo(c, '#009A5E')} />
        )}
        {bandana && arte && (
          <G fill="#FFFFFF" opacity={0.85}>
            <Circle cx="92" cy="118" r="2" />
            <Circle cx="108" cy="118" r="2" />
            <Circle cx="100" cy="130" r="2" />
          </G>
        )}

        {/* Orelhas */}
        <Path d="M64 58 C 44 60, 40 96, 52 108 C 62 112, 70 92, 72 70 Z" {...estilo(c, MARROM_ESCURO)} />
        <Path d="M136 58 C 156 60, 160 96, 148 108 C 138 112, 130 92, 128 70 Z" {...estilo(c, MARROM_ESCURO)} />

        {/* Cabeça */}
        <Ellipse cx="100" cy="76" rx="38" ry="36" {...estilo(c, MARROM)} />

        {/* Focinho */}
        <Ellipse cx="100" cy="94" rx="20" ry="14" {...estilo(c, FOCINHO)} />

        {arte && (
          <G>
            {/* Olhos */}
            <Circle cx="85" cy="74" r="5" fill="#1F1F1F" />
            <Circle cx="115" cy="74" r="5" fill="#1F1F1F" />
            <Circle cx="86.6" cy="72.2" r="1.6" fill="#FFFFFF" />
            <Circle cx="116.6" cy="72.2" r="1.6" fill="#FFFFFF" />
            {/* Bochechas */}
            <Ellipse cx="76" cy="88" rx="5" ry="3" fill="#E58C7A" opacity={0.55} />
            <Ellipse cx="124" cy="88" rx="5" ry="3" fill="#E58C7A" opacity={0.55} />
            {/* Nariz + boca */}
            <Ellipse cx="100" cy="88" rx="7" ry="5" fill="#1F1F1F" />
            <Path d="M100 93 L100 98 M92 99 Q100 104 108 99" stroke={CONTORNO} strokeWidth={2.5} fill="none" strokeLinecap="round" />
            {/* Topete */}
            <Path d="M94 42 q4 -6 8 0 q4 -6 8 0" stroke={CONTORNO} strokeWidth={2.5} fill="none" strokeLinecap="round" />
          </G>
        )}

        {/* Lápis na boca */}
        {pose === 'lapis' && (
          <G transform="rotate(-8 100 100)">
            <Rect x="50" y="96" width="92" height="10" rx="2" {...estilo(c, '#F1C321')} />
            <Path d="M142 96 L158 101 L142 106 Z" {...estilo(c, '#F3D9B1')} />
            <Rect x="44" y="96" width="10" height="10" rx="2" {...estilo(c, '#FE8A8A')} />
            {arte && <Path d="M154 100 L158 101 L154 102 Z" fill="#1F1F1F" />}
          </G>
        )}

        {/* Ticket na boca */}
        {pose === 'ticket' && (
          <G transform="rotate(-10 100 100)">
            <Rect x="96" y="94" width="66" height="30" rx="3" {...estilo(c, '#FAF3E0')} />
            {arte && (
              <G>
                <Line x1="146" y1="96" x2="146" y2="122" stroke={CONTORNO} strokeWidth={1.5} strokeDasharray="3 3" />
                <SvgText x="121" y="108" fontSize="8" fontWeight="900" fill="#3B2A22" textAnchor="middle">
                  VALE
                </SvgText>
                <SvgText x="121" y="118" fontSize="7" fontWeight="700" fill="#3B2A22" textAnchor="middle">
                  APOIO
                </SvgText>
                <Path d="M150 100 V118 M153 100 V118 M157 100 V118" stroke="#1F1F1F" strokeWidth={1.5} />
              </G>
            )}
          </G>
        )}
      </>
    );
  };

  return <Adesivo size={size} render={render} />;
}
