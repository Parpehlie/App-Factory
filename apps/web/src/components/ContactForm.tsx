import { FormEvent, useState } from 'react';
import { PROFILE } from '../data/projects';
import { navigateTo } from '../lib/router';

const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || 'REMPLACE_MOI';

type FormStatus = 'idle' | 'sending' | 'sent' | 'error';

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>('idle');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const company = String(data.get('company') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const subject = String(data.get('subject') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();
    const botcheck = String(data.get('botcheck') ?? '').trim();

    if (botcheck) {
      setStatus('sent');
      form.reset();
      return;
    }

    // Si aucune clé Web3Forms n'est injectée en build, ouvrir le client mail directement
    if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY === 'REMPLACE_MOI') {
      const body = [
        `Nom : ${name}`,
        company ? `Activité / Entreprise : ${company}` : null,
        `E-mail : ${email}`,
        '',
        message,
      ]
        .filter(Boolean)
        .join('\n');
      window.location.href = `mailto:${PROFILE.email}?subject=${encodeURIComponent(`Parphélie — ${subject}`)}&body=${encodeURIComponent(body)}`;
      setStatus('sent');
      return;
    }

    setStatus('sending');
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `Parphélie — ${subject}`,
          from_name: 'Site Parphélie (parphelie.com)',
          name: company ? `${name} (${company})` : name,
          email,
          message,
          botcheck: false,
        }),
      });
      const result = (await response.json()) as { success?: boolean };
      if (!response.ok || !result.success) throw new Error('web3forms');
      form.reset();
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  return (
    <form className="hub-form" onSubmit={handleSubmit}>
      <div className="hub-form-row">
        <label className="hub-field">
          <span>Votre nom</span>
          <input name="name" type="text" autoComplete="name" required placeholder="Camille Martin" />
        </label>
        <label className="hub-field">
          <span>Activité / Entreprise (optionnel)</span>
          <input name="company" type="text" autoComplete="organization" placeholder="Menuiserie Martin" />
        </label>
      </div>

      <div className="hub-form-row">
        <label className="hub-field">
          <span>Votre e-mail</span>
          <input name="email" type="email" autoComplete="email" required placeholder="camille@exemple.fr" />
        </label>
        <label className="hub-field">
          <span>Sujet</span>
          <select name="subject" defaultValue="Site pour mon activité (Atlas)">
            <option>Site pour mon activité (Atlas)</option>
            <option>Application ou produit sur-mesure</option>
            <option>Question sur un projet (QoreDB, Vestiges, Melios, Leximon…)</option>
            <option>Autre demande</option>
          </select>
        </label>
      </div>

      <label className="hub-field">
        <span>Votre message</span>
        <textarea
          name="message"
          required
          rows={4}
          placeholder="Parlez-moi en quelques mots de votre activité ou de votre projet…"
        />
      </label>

      <input
        type="text"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="sr-only"
      />

      <p className="hub-form-note">
        Vos données servent uniquement à vous répondre.{' '}
        <a href="/privacy" onClick={(e) => navigateTo('/privacy', e)}>
          Politique de confidentialité
        </a>
        .
      </p>

      <div className="hub-form-actions">
        <button type="submit" className="btn btn-beacon" disabled={status === 'sending'}>
          {status === 'sending' ? 'Envoi en cours…' : 'Envoyer le message →'}
        </button>
      </div>

      <div className="hub-form-status" role="status" aria-live="polite" data-state={status}>
        {status === 'sent' && 'Merci ! Votre message est bien parti. Je vous réponds personnellement sous 24 à 48 h.'}
        {status === 'error' &&
          `L’envoi n’a pas abouti. Écrivez-moi à ${PROFILE.email} ou appelez le ${PROFILE.phoneDisplay}.`}
      </div>
    </form>
  );
}
