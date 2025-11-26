
#--- Codigo Modulo sensor de Condutividade ---

from machine import ADC
import time

#--- variaveis ---

Vref = 3.3
a = 1.0   #Variavel 1 de calibração
b = 0     # variafvel 2 de calibração
alfa = 0.02  # Constante de ajsute para temperatura
temperatura = 24
amostras = 20

adc1 = ADC(28)

#--- funções ---

def tensao_condutividade():  # Essa função faz a leitura da  porta analogica e transforma o valor medido em tensão
    total = 0
    for _ in range(amostras):  # nesse ponto fazemos a leitura de varias amostras e tiramos uma media para maior precisão
        total += adc1.read_u16()
        time.sleep(0.01)
        
    leitura = total/amostras
    V = leitura * Vref / 65535
    return V

def calibrar_condutividade(V):  # Essa função pega a tensão medida pela sonsa e realiza uma calibraçãoa com base e fluidos tampões
    VC = a * V + b
    return VC

def calibrar_temperatura_condutividade(VC):  # Essa função faz uma calibração referente a temperatura do ambiente 
    VCT = VC / (1 + alfa) * (temperatura - 25)
    return VCT

#--- Codigo princiapl ---

while(True):
    tensaoC = tensao_condutividade()
    tensaoCC = calibrar_condutividade(tensaoC)
    tensaoCCT = calibrar_temperatura_condutividade(tensaoCC)
    analog = adc1.read_u16()
    print("Tensão medida = {:.3f} V  / EC = {:.3f} mS/cm  / leitura_Analogica = {:.3f}".format(tensaoC, tensaoCCT, analog))
    
    time.sleep(1)