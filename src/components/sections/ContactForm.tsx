import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Mail, MapPin, Phone } from "lucide-react";
import {
  Button,
  ButtonLink,
  Card,
  Container,
  Field,
  Heading,
  Input,
  Overline,
  Reveal,
  Section,
  Select,
  Text,
  Textarea,
  describedBy,
} from "../ui";
import { contact } from "../../data/content";
import { site, waLink } from "../../data/site";
import { maskPhone, onlyDigits } from "../../lib/format";
import { ICON } from "../../lib/icons";

const fields = contact.form.fields;

const schema = z.object({
  name: z.string().trim().min(2, "Informe seu nome completo."),
  email: z.string().trim().min(1, "Informe um e-mail.").email("E-mail inválido."),
  phone: z
    .string()
    .trim()
    .min(1, "Informe um telefone.")
    .refine((value) => onlyDigits(value).length >= 10, "Telefone incompleto. Inclua o DDD."),
  city: z.string().trim().optional(),
  interest: z.string().min(1, "Selecione um interesse."),
  bill: z.string().trim().optional(),
  message: z.string().trim().optional(),
  /** Honeypot: preenchido só por robô. */
  website: z.string().max(0).optional(),
});

type FormValues = z.infer<typeof schema>;

type Status = "idle" | "submitting" | "success" | "error";

const endpoint = import.meta.env.VITE_FORM_ENDPOINT as string | undefined;

/** Monta a mensagem de WhatsApp quando não há endpoint configurado. */
function buildWhatsAppMessage(values: FormValues): string {
  const interest =
    fields.interest.options.find((option) => option.value === values.interest)?.label ?? "";

  return [
    "Olá, Halo! Gostaria de uma análise técnica.",
    `Nome: ${values.name}`,
    `E-mail: ${values.email}`,
    `Telefone: ${values.phone}`,
    values.city ? `Cidade: ${values.city}` : null,
    `Interesse: ${interest}`,
    values.bill ? `Conta média: ${values.bill}` : null,
    values.message ? `Mensagem: ${values.message}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

/** 11. Contato — #contato */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { interest: "", website: "" },
  });

  const onSubmit = async (values: FormValues) => {
    if (values.website) return; // robô: descarta silenciosamente

    // Sem endpoint configurado, o envio vira uma conversa de WhatsApp.
    if (!endpoint) {
      window.open(waLink(buildWhatsAppMessage(values)), "_blank", "noopener,noreferrer");
      setStatus("success");
      reset();
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error(`Falha no envio: ${response.status}`);
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <Section id={contact.id} tone="subtle">
      <Container width="max">
        <div className="grid gap-gutter lg:grid-cols-2 items-start">
          <Reveal>
            <Overline>{contact.eyebrow}</Overline>
            <Heading level="h2" className="mt-2 mb-2">
              {contact.title}
            </Heading>
            <Text tone="muted" measure>
              {contact.subtitle}
            </Text>

            <Text className="mt-6" measure>
              {contact.argument}
            </Text>

            <div className="mt-7">
              <Overline>{contact.detailsLabel}</Overline>
              <ul className="list-none m-0 p-0 mt-4 flex flex-col gap-3">
                <li>
                  <a
                    href={`tel:${site.phoneHref}`}
                    className="inline-flex items-center gap-3 font-body text-base no-underline text-ink hover:text-primary transition-colors duration-halo ease-halo"
                  >
                    <Phone size={ICON.md} strokeWidth={ICON.stroke} aria-hidden className="text-primary" />
                    {site.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${site.email}`}
                    className="inline-flex items-center gap-3 font-body text-base no-underline text-ink hover:text-primary transition-colors duration-halo ease-halo"
                  >
                    <Mail size={ICON.md} strokeWidth={ICON.stroke} aria-hidden className="text-primary" />
                    {site.email}
                  </a>
                </li>
                <li className="inline-flex items-center gap-3 font-body text-base text-ink">
                  <MapPin size={ICON.md} strokeWidth={ICON.stroke} aria-hidden className="text-primary" />
                  {site.region}
                </li>
              </ul>
            </div>

            <ButtonLink
              variant="outline"
              size="md"
              href={waLink(contact.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6"
            >
              {contact.whatsappCta}
            </ButtonLink>
          </Reveal>

          <Reveal index={1}>
            <Card padding="lg" interactive={false}>
              <h3 className="font-display font-semibold text-xl">{contact.form.title}</h3>
              <Text size="sm" tone="muted" className="mt-2">
                {contact.form.requiredHint}
              </Text>

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 flex flex-col gap-5">
                {/* Honeypot — invisível para pessoas, irresistível para robôs. */}
                <div className="hidden" aria-hidden>
                  <label htmlFor="website">Não preencha este campo</label>
                  <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
                </div>

                <Field id="name" label={fields.name.label} required error={errors.name?.message}>
                  <Input
                    id="name"
                    autoComplete="name"
                    placeholder={fields.name.placeholder}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={describedBy("name", undefined, errors.name?.message)}
                    {...register("name")}
                  />
                </Field>

                <Field id="email" label={fields.email.label} required error={errors.email?.message}>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder={fields.email.placeholder}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={describedBy("email", undefined, errors.email?.message)}
                    {...register("email")}
                  />
                </Field>

                <Field id="phone" label={fields.phone.label} required error={errors.phone?.message}>
                  <Input
                    id="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder={fields.phone.placeholder}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={describedBy("phone", undefined, errors.phone?.message)}
                    {...register("phone")}
                    onChange={(event) => setValue("phone", maskPhone(event.target.value))}
                  />
                </Field>

                <Field id="city" label={fields.city.label} error={errors.city?.message}>
                  <Input
                    id="city"
                    autoComplete="address-level2"
                    placeholder={fields.city.placeholder}
                    {...register("city")}
                  />
                </Field>

                <Field
                  id="interest"
                  label={fields.interest.label}
                  required
                  error={errors.interest?.message}
                >
                  <Select
                    id="interest"
                    aria-invalid={Boolean(errors.interest)}
                    aria-describedby={describedBy("interest", undefined, errors.interest?.message)}
                    {...register("interest")}
                  >
                    <option value="">{fields.interest.placeholder}</option>
                    {fields.interest.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </Field>

                <Field id="bill" label={fields.bill.label} error={errors.bill?.message}>
                  <Input id="bill" inputMode="decimal" placeholder={fields.bill.placeholder} {...register("bill")} />
                </Field>

                <Field id="message" label={fields.message.label} error={errors.message?.message}>
                  <Textarea
                    id="message"
                    rows={4}
                    placeholder={fields.message.placeholder}
                    {...register("message")}
                  />
                </Field>

                <Button type="submit" variant="primary" size="lg" block disabled={status === "submitting"}>
                  {status === "submitting" ? contact.form.submittingLabel : contact.form.submitLabel}
                </Button>

                <div aria-live="polite">
                  {status === "success" && (
                    <div className="border-l-btn border-success bg-success-soft rounded-sm p-4">
                      <p className="font-body text-base font-medium text-green-700">
                        {contact.form.successTitle}
                      </p>
                      <Text size="sm" tone="muted" className="mt-1">
                        {contact.form.successMessage}
                      </Text>
                    </div>
                  )}
                  {status === "error" && (
                    <div className="border-l-btn border-danger bg-danger-soft rounded-sm p-4">
                      <p className="font-body text-base font-medium text-danger">
                        {contact.form.errorTitle}
                      </p>
                      <Text size="sm" tone="muted" className="mt-1">
                        {contact.form.errorMessage}
                      </Text>
                    </div>
                  )}
                </div>
              </form>
            </Card>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
