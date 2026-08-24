import { useState } from "react";
import { Container, Reveal, Section, SectionHeader, TabPanel, Tabs, Text } from "../ui";
import { EvSimulator } from "./EvSimulator";
import { SavingsSimulator } from "./SavingsSimulator";
import { simulators } from "../../data/content";

/** 9. Simuladores — #simuladores */
export function Simulators() {
  const [tab, setTab] = useState(simulators.tabs[0].id);

  return (
    <Section id={simulators.id} tone="subtle">
      <Container width="max">
        <Reveal>
          <SectionHeader
            overline={simulators.eyebrow}
            title={simulators.title}
            description={simulators.subtitle}
          />
        </Reveal>

        <Reveal index={1}>
          <Tabs
            items={simulators.tabs}
            value={tab}
            onValueChange={setTab}
            label={simulators.tabsLabel}
            idPrefix="sim"
          />

          <div className="mt-7">
            <TabPanel id="savings" idPrefix="sim" active={tab === "savings"}>
              <SavingsSimulator />
            </TabPanel>
            <TabPanel id="ev" idPrefix="sim" active={tab === "ev"}>
              <EvSimulator />
            </TabPanel>
          </div>

          <Text size="sm" tone="muted" className="mt-6 max-w-measure">
            {simulators.disclaimer}
          </Text>
        </Reveal>
      </Container>
    </Section>
  );
}
