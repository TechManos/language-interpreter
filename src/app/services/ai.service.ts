import {Injectable} from '@angular/core';
import OpenAI from 'openai';
import {environment} from 'src/environments/environment';

// export interface CompletionResult {
//   fromName: string;
//   subject: string;
//   date: string;
//   id: number;
//   read: boolean;
//   input?: string | undefined;
//   output?: string | undefined;
// }

@Injectable({
  providedIn: 'root',
})
export class AiService {
  openai = new OpenAI({
    // apiKey: process.env.OPENAI_API_KEY,
    apiKey: environment.openapi.apiKey,
    dangerouslyAllowBrowser: true,
  });

  constructor() {}

  async postMessage(message: string): Promise<any> {
    // return { response: 'TestResponse' };

    return await this.openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'Vašou úlohou je pomôcť používateľovi pochopiť slovenskú slovnú zásobu, predovšetkým v kontexte čítania série Zaklínač v slovenčine. Budete vysvetľovať významy slovenských slov podľa požiadaviek používateľa. Pri poskytovaní definícií zahrňte 1-2 príklady, ako možno slovo použiť vo vetách, aby používateľ lepšie pochopil jeho použitie. Ak nie je uvedené inak, vysvetlenie má byť v slovenskom jazyku. Ak používateľ zadá slovo s gramatickými chybami, pokúste sa identifikovať správne pravopis a poskytnite vysvetlenie s použitím správnej formy slova. Ak používateľ nerozumie vysvetleniu v slovenčine, poskytnite preklady a ďalšie vysvetlenia najprv v angličtine, potom v ukrajinčine a ak je to potrebné, v ruštine. Používateľ celkom dobre ovláda slovenčinu, veľmi dobre ukrajinčinu, angličtinu a ruštinu. Poskytnite stručné, ale informatívne vysvetlenie alebo definíciu, pričom celkové vysvetlenie alebo definícia by nemali presiahnuť 65 slov. Kde je to relevantné, môžete poskytnúť historický alebo kultúrny kontext, ale zabezpečte, aby to neprevažovalo nad hlavným vysvetlením. Prispôsobte zložitosť svojho jazyka na základe úrovne porozumenia používateľa, postupne zjednodušujte vysvetlenia alebo používajte zrozumiteľnejšie termíny, ak počiatočné odpovede nie sú pochopené. Vaše odpovede by mali byť prispôsobené používateľovi, ktorý je ochotný učiť sa a ocení priateľský, podporný prístup k učeniu jazyka.',
        },
        {
          role: 'user',
          content: `Vysvetli, prosím, slovo "${message}" v slovenčine`,
        },
      ],
      model: 'gpt-3.5-turbo',
    });

    // return Promise.resolve({
    //   choices: [
    //     {
    //       finish_reason: 'stop',
    //       index: 0,
    //       message: {
    //         content:
    //           'The 2020 World Series was played in Texas at Globe Life Field in Arlington.',
    //         role: 'assistant',
    //       },
    //       logprobs: null,
    //     },
    //   ],
    //   created: 1677664795,
    //   id: 'chatcmpl-7QyqpwdfhqwajicIEznoc6Q47XAyW',
    //   model: 'gpt-3.5-turbo-0613',
    //   object: 'chat.completion',
    //   usage: {
    //     completion_tokens: 17,
    //     prompt_tokens: 57,
    //     total_tokens: 74,
    //   },
    // });
  }
}
