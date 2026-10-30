import { site } from "../data/site";

const REGEX_WHATSAPP_BR = /^55\d{10,11}$/;

export function whatsappConfigurado(): boolean {
  const numero = site.contato.whatsappNumero.replace(/\D/g, "");
  return REGEX_WHATSAPP_BR.test(numero);
}

export function linkWhatsapp(
  mensagem: string = site.contato.whatsappMensagemPadrao
): string {
  const numero = site.contato.whatsappNumero.replace(/\D/g, "");
  if (!REGEX_WHATSAPP_BR.test(numero)) {
    // Em dev: avisa no console. Em build: aponta para #contato caso ainda não preenchido,
    // ou prepara o link wa.me assim que o número for informado no site.ts.
    if (typeof console !== "undefined") {
      console.warn(
        "[site.ts] whatsappNumero ausente ou fora do padrão 55+DDD+número."
      );
    }
    return `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
  }
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}
