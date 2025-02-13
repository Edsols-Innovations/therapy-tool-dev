import { renderInputField } from './RenderInputField';

interface MilestoneProps {
  onResponseChange: (category: string, question: string, value: string) => void;
}

// **2 Months Components**
export const TwoMonthsSocial = ({ onResponseChange }: MilestoneProps) => (
  <div className="p-5 bg-white rounded-3xl shadow-md mb-8">
    <h3 className="text-lg font-semibold mb-4">Social/Emotional Milestones</h3>
    {[
      { label: 'Does the baby calm down when spoken to or picked up?', type: 'radio', options: ['Yes', 'No'], category: 'social'},
      { label: 'Does the baby look at your face?', type: 'radio', options: ['Yes', 'No'], category: 'social' },
      { label: 'Does the baby seem happy to see you when you approach?', type: 'radio', options: ['Yes', 'No'], category: 'social' },
      { label: 'Does the baby smile when you talk or smile at them?', type: 'radio', options: ['Yes', 'No'], category: 'social' }
    ].map((field) => renderInputField({ field, onChange: onResponseChange }))}
  </div>
);

export const TwoMonthsLanguage = ({ onResponseChange }: MilestoneProps) => (
  <div className="p-5 bg-white rounded-3xl shadow-md mb-8">
    <h3 className="text-lg font-semibold mb-4">Language/Communication Milestones</h3>
    {[
      { label: 'Does the baby make sounds other than crying?', type: 'radio', options: ['Yes', 'No'],category: 'language' },
      { label: 'Does the baby react to loud sounds?', type: 'radio', options: ['Yes', 'No'],category: 'language' }
    ].map((field) => renderInputField({ field, onChange: onResponseChange }))}
  </div>
);

export const TwoMonthsCognitive = ({ onResponseChange }: MilestoneProps) => (
  <div className="p-5 bg-white rounded-3xl shadow-md mb-8">
    <h3 className="text-lg font-semibold mb-4">Cognitive Milestones</h3>
    {[
      { label: 'Does the baby watch you as you move?', type: 'radio', options: ['Yes', 'No'],category: 'cognitive' },
      { label: 'Does the baby look at a toy for several seconds?', type: 'radio', options: ['Yes', 'No'],category: 'cognitive' }
    ].map((field) => renderInputField({ field, onChange: onResponseChange }))}
  </div>
);

export const TwoMonthsMovement = ({ onResponseChange }: MilestoneProps) => (
  <div className="p-5 bg-white rounded-3xl shadow-md mb-8">
    <h3 className="text-lg font-semibold mb-4">Movement/Physical Development Milestones</h3>
    {[
      { label: 'Can the baby hold their head up when lying on their tummy?', type: 'radio', options: ['Yes', 'No'],category: 'movement' },
      { label: 'Does the baby move both arms and both legs?', type: 'radio', options: ['Yes', 'No'],category: 'movement' },
      { label: 'Does the baby briefly open their hands?', type: 'radio', options: ['Yes', 'No'],category: 'movement' }
    ].map((field) => renderInputField({ field, onChange: onResponseChange }))}
  </div>
);

export const TwoMonths = ({ onResponseChange }: MilestoneProps) => (
  <div id="two-months">
    <h2 className="text-2xl font-bold mb-6">2 Months</h2>
    <TwoMonthsSocial onResponseChange={onResponseChange}/>
    <TwoMonthsLanguage onResponseChange={onResponseChange}/>
    <TwoMonthsCognitive onResponseChange={onResponseChange}/>
    <TwoMonthsMovement onResponseChange={onResponseChange}/>
  </div>
);

// **4 Months Components**
export const FourMonthsSocial = ({ onResponseChange }: MilestoneProps) => (
  <div className="p-5 bg-white rounded-3xl shadow-md mb-8">
    <h3 className="text-lg font-semibold mb-4">Social/Emotional Milestones</h3>
    {[
      { label: 'Does the baby smile on their own to get your attention?', type: 'radio', options: ['Yes', 'No'], category: 'social' },
      { label: 'Does the baby chuckle when you try to make them laugh?', type: 'radio', options: ['Yes', 'No'], category: 'social' },
      { label: 'Does the baby look at you, move, or make sounds to get or keep your attention?', type: 'radio', options: ['Yes', 'No'], category: 'social' }
    ].map((field) => renderInputField({ field, onChange: onResponseChange }))}
  </div>
);

export const FourMonthsLanguage = ({ onResponseChange }: MilestoneProps) => (
  <div className="p-5 bg-white rounded-3xl shadow-md mb-8">
    <h3 className="text-lg font-semibold mb-4">Language/Communication Milestones</h3>
    {[
      { label: 'Does the baby make sounds like "oooo" or "aahh" (cooing)?', type: 'radio', options: ['Yes', 'No'],category: 'language'  },
      { label: 'Does the baby make sounds back when you talk to them?', type: 'radio', options: ['Yes', 'No'],category: 'language'  },
      { label: 'Does the baby turn their head towards the sound of your voice?', type: 'radio', options: ['Yes', 'No'] ,category: 'language' }
    ].map((field) => renderInputField({ field, onChange: onResponseChange }))}
  </div>
);

export const FourMonthsCognitive = ({ onResponseChange }: MilestoneProps) => (
  <div className="p-5 bg-white rounded-3xl shadow-md mb-8">
    <h3 className="text-lg font-semibold mb-4">Cognitive Milestones</h3>
    {[
      { label: 'If hungry, does the baby open their mouth when they see the breast or bottle?', type: 'radio', options: ['Yes', 'No'] ,category: 'cognitive' },
      { label: 'Does the baby look at their hands with interest?', type: 'radio', options: ['Yes', 'No'] ,category: 'cognitive' }
    ].map((field) => renderInputField({ field, onChange: onResponseChange }))}
  </div>
);

export const FourMonthsMovement = ({ onResponseChange }: MilestoneProps) => (
  <div className="p-5 bg-white rounded-3xl shadow-md mb-8">
    <h3 className="text-lg font-semibold mb-4">Movement/Physical Development Milestones</h3>
    {[
      { label: 'Can the baby hold their head steady without support when you are holding them?', type: 'radio', options: ['Yes', 'No'] ,category: 'movement' },
      { label: 'Does the baby hold a toy when you put it in their hand?', type: 'radio', options: ['Yes', 'No'] ,category: 'movement' },
      { label: 'Does the baby use his arm to swing at toys?', type: 'radio', options: ['Yes', 'No'] ,category: 'movement' },
      { label: 'Does the baby bring hands to mouth?', type: 'radio', options: ['Yes', 'No'] ,category: 'movement' },
      { label: 'Does the baby push up onto elbows/forearms when on tummy?', type: 'radio', options: ['Yes', 'No'] ,category: 'movement' }
    ].map((field) => renderInputField({ field, onChange: onResponseChange }))}
  </div>
);

export const FourMonths = ({ onResponseChange }: MilestoneProps) => (
  <div id="four-months">
    <h2 className="text-2xl font-bold mb-6">4 Months</h2>
    <FourMonthsSocial onResponseChange={onResponseChange} />
    <FourMonthsLanguage onResponseChange={onResponseChange} />
    <FourMonthsCognitive onResponseChange={onResponseChange} />
    <FourMonthsMovement onResponseChange={onResponseChange} />
  </div>
);

// **6 Months Components**
export const SixMonthsSocial = ({ onResponseChange }: MilestoneProps) => (
  <div className="p-5 bg-white rounded-3xl shadow-md mb-8">
    <h3 className="text-lg font-semibold mb-4">Social/Emotional Milestones</h3>
    {[
      { label: 'Does the baby recognize familiar people?', type: 'radio', options: ['Yes', 'No'] , category: 'social'},
      { label: 'Does the baby enjoy looking at themselves in a mirror?', type: 'radio', options: ['Yes', 'No'] , category: 'social'},
      { label: 'Does the baby laugh?', type: 'radio', options: ['Yes', 'No'] , category: 'social'}
    ].map((field) => renderInputField({ field, onChange: onResponseChange }))}
  </div>
);

export const SixMonthsLanguage = ({ onResponseChange }: MilestoneProps) => (
  <div className="p-5 bg-white rounded-3xl shadow-md mb-8">
    <h3 className="text-lg font-semibold mb-4">Language/Communication Milestones</h3>
    {[
      { label: 'Does the baby take turns making sounds with you?', type: 'radio', options: ['Yes', 'No'] ,category: 'language' },
      { label: 'Does the baby blow "raspberries" (stick out tongue and blow)?', type: 'radio', options: ['Yes', 'No'] ,category: 'language' },
      { label: 'Does the baby make squealing noises?', type: 'radio', options: ['Yes', 'No'] ,category: 'language' }
    ].map((field) => renderInputField({ field, onChange: onResponseChange }))}
  </div>
);

export const SixMonthsCognitive = ({ onResponseChange }: MilestoneProps) => (
  <div className="p-5 bg-white rounded-3xl shadow-md mb-8">
    <h3 className="text-lg font-semibold mb-4">Cognitive Milestones</h3>
    {[
      { label: 'Does the baby put things in their mouth to explore them?', type: 'radio', options: ['Yes', 'No'] ,category: 'cognitive' },
      { label: 'Does the baby reach to grab a toy they want?', type: 'radio', options: ['Yes', 'No'] ,category: 'cognitive' },
      { label: 'Does the baby close their lips to indicate they don’t want more food?', type: 'radio', options: ['Yes', 'No'] ,category: 'cognitive' }
    ].map((field) => renderInputField({ field, onChange: onResponseChange }))}
  </div>
);

export const SixMonthsMovement = ({ onResponseChange }: MilestoneProps) => (
  <div className="p-5 bg-white rounded-3xl shadow-md mb-8">
    <h3 className="text-lg font-semibold mb-4">Movement/Physical Development Milestones</h3>
    {[
      { label: 'Can the baby roll from tummy to back?', type: 'radio', options: ['Yes', 'No'] ,category: 'movement' },
      { label: 'Does the baby push up with straight arms when on their tummy?', type: 'radio', options: ['Yes', 'No'] ,category: 'movement' },
      { label: 'Does the baby lean on their hands for support while sitting?', type: 'radio', options: ['Yes', 'No'] ,category: 'movement' }
    ].map((field) => renderInputField({ field, onChange: onResponseChange }))}
  </div>
);

export const SixMonths = ({ onResponseChange }: MilestoneProps) => (
  <div id="six-months">
    <h2 className="text-2xl font-bold mb-6">6 Months</h2>
    <SixMonthsSocial onResponseChange={onResponseChange} />
    <SixMonthsLanguage onResponseChange={onResponseChange} />
    <SixMonthsCognitive onResponseChange={onResponseChange} />
    <SixMonthsMovement onResponseChange={onResponseChange} />
  </div>
);

// **9 Months Components**
export const NineMonthsSocial = ({ onResponseChange }: MilestoneProps) => (
  <div className="p-5 bg-white rounded-3xl shadow-md mb-8">
    <h3 className="text-lg font-semibold mb-4">Social/Emotional Milestones</h3>
    {[
      { label: 'Is the baby shy, clingy, or fearful around strangers?', type: 'radio', options: ['Yes', 'No'] , category: 'social'},
      { label: 'Does the baby show several facial expressions (e.g., happy, sad, angry, surprised)?', type: 'radio', options: ['Yes', 'No'] , category: 'social'},
      { label: 'Does the baby look when you call their name?', type: 'radio', options: ['Yes', 'No'] , category: 'social'},
      { label: 'Does the baby react when you leave (e.g., looks for you, reaches, or cries)?', type: 'radio', options: ['Yes', 'No'] , category: 'social'},
      { label: 'Does the baby smile or laugh when you play peek-a-boo?', type: 'radio', options: ['Yes', 'No'] , category: 'social'}
    ].map((field) => renderInputField({ field, onChange: onResponseChange }))}
  </div>
);

export const NineMonthsLanguage = ({ onResponseChange }: MilestoneProps) => (
  <div className="p-5 bg-white rounded-3xl shadow-md mb-8">
    <h3 className="text-lg font-semibold mb-4">Language/Communication Milestones</h3>
    {[
      { label: 'Does the baby make various sounds like "mamamama" or "dadadada"?', type: 'radio', options: ['Yes', 'No'] ,category: 'language' },
      { label: 'Does the baby lift their arms to be picked up?', type: 'radio', options: ['Yes', 'No'] ,category: 'language' }
    ].map((field) => renderInputField({ field, onChange: onResponseChange }))}
  </div>
);

export const NineMonthsCognitive = ({ onResponseChange }: MilestoneProps) => (
  <div className="p-5 bg-white rounded-3xl shadow-md mb-8">
    <h3 className="text-lg font-semibold mb-4">Cognitive Milestones</h3>
    {[
      { label: 'Does the baby look for objects that are out of sight (e.g., a dropped spoon or toy)?', type: 'radio', options: ['Yes', 'No'] ,category: 'cognitive' },
      { label: 'Does the baby bang two objects together?', type: 'radio', options: ['Yes', 'No'] ,category: 'cognitive' }
    ].map((field) => renderInputField({ field, onChange: onResponseChange }))}
  </div>
);

export const NineMonthsMovement = ({ onResponseChange }: MilestoneProps) => (
  <div className="p-5 bg-white rounded-3xl shadow-md mb-8">
    <h3 className="text-lg font-semibold mb-4">Movement/Physical Development Milestones</h3>
    {[
      { label: 'Can the baby get to a sitting position by themselves?', type: 'radio', options: ['Yes', 'No'] ,category: 'movement' },
      { label: 'Does the baby move objects from one hand to the other?', type: 'radio', options: ['Yes', 'No'] ,category: 'movement' },
      { label: 'Does the baby use their fingers to "rake" food towards themselves?', type: 'radio', options: ['Yes', 'No'] ,category: 'movement' },
      { label: 'Can the baby sit without support?', type: 'radio', options: ['Yes', 'No'] ,category: 'movement' }
    ].map((field) => renderInputField({ field, onChange: onResponseChange }))}
  </div>
);

export const NineMonths = ({ onResponseChange }: MilestoneProps) => (
  <div id="nine-months">
    <h2 className="text-2xl font-bold mb-6">9 Months</h2>
    <NineMonthsSocial onResponseChange={onResponseChange} />
    <NineMonthsLanguage onResponseChange={onResponseChange} />
    <NineMonthsCognitive onResponseChange={onResponseChange} />
    <NineMonthsMovement onResponseChange={onResponseChange} />
  </div>
);

// **1 Year Components**
export const OneYearSocial = ({ onResponseChange }: MilestoneProps) => (
  <div className="p-5 bg-white rounded-3xl shadow-md mb-8">
    <h3 className="text-lg font-semibold mb-4">Social/Emotional Milestones</h3>
    {[
      { label: 'Does the child play interactive games with you, like pat-a-cake?', type: 'radio', options: ['Yes', 'No'] , category: 'social'}
    ].map((field) => renderInputField({ field, onChange: onResponseChange }))}
  </div>
);

export const OneYearLanguage = ({ onResponseChange }: MilestoneProps) => (
  <div className="p-5 bg-white rounded-3xl shadow-md mb-8">
    <h3 className="text-lg font-semibold mb-4">Language/Communication Milestones</h3>
    {[
      { label: 'Does the child wave "bye-bye"?', type: 'radio', options: ['Yes', 'No'] ,category: 'language' },
      { label: 'Does the child call a parent "mama," "dada," or use another special name?', type: 'radio', options: ['Yes', 'No'] ,category: 'language' },
      { label: 'Does the child understand "no" and pause briefly or stop when you say it?', type: 'radio', options: ['Yes', 'No'] ,category: 'language' }
    ].map((field) => renderInputField({ field, onChange: onResponseChange }))}
  </div>
);

export const OneYearCognitive = ({ onResponseChange }: MilestoneProps) => (
  <div className="p-5 bg-white rounded-3xl shadow-md mb-8">
    <h3 className="text-lg font-semibold mb-4">Cognitive Milestones</h3>
    {[
      { label: 'Can the child put something in a container, like a block in a cup?', type: 'radio', options: ['Yes', 'No'] ,category: 'cognitive' },
      { label: 'Does the child look for things that you hide, like a toy under a blanket?', type: 'radio', options: ['Yes', 'No'] ,category: 'cognitive' }
    ].map((field) => renderInputField({ field, onChange: onResponseChange }))}
  </div>
);

export const OneYearMovement = ({ onResponseChange }: MilestoneProps) => (
  <div className="p-5 bg-white rounded-3xl shadow-md mb-8">
    <h3 className="text-lg font-semibold mb-4">Movement/Physical Development Milestones</h3>
    {[
      { label: 'Can the child pull up to stand?', type: 'radio', options: ['Yes', 'No'] ,category: 'movement' },
      { label: 'Does the child walk while holding on to furniture?', type: 'radio', options: ['Yes', 'No'] ,category: 'movement' },
      { label: 'Does the child drink from a cup without a lid if you hold it?', type: 'radio', options: ['Yes', 'No'] ,category: 'movement' },
      { label: 'Can the child pick up small items between their thumb and pointer finger, like bits of food?', type: 'radio', options: ['Yes', 'No'] ,category: 'movement' }
    ].map((field) => renderInputField({ field, onChange: onResponseChange }))}
  </div>
);

export const OneYear = ({ onResponseChange }: MilestoneProps) => (
  <div id="one-year">
    <h2 className="text-2xl font-bold mb-6">1 Year</h2>
    <OneYearSocial onResponseChange={onResponseChange} />
    <OneYearLanguage onResponseChange={onResponseChange} />
    <OneYearCognitive onResponseChange={onResponseChange} />
    <OneYearMovement onResponseChange={onResponseChange} />
  </div>
);

// **15 Months Components**
export const FifteenMonthsSocial = ({ onResponseChange }: MilestoneProps) => (
  <div className="p-5 bg-white rounded-3xl shadow-md mb-8">
    <h3 className="text-lg font-semibold mb-4">Social/Emotional Milestones</h3>
    {[
      { label: 'Does the child copy other children during play, like taking toys out of a container when another child does?', type: 'radio', options: ['Yes', 'No'] , category: 'social'},
      { label: 'Does the child show you an object they like?', type: 'radio', options: ['Yes', 'No'] , category: 'social'},
      { label: 'Does the child clap when excited?', type: 'radio', options: ['Yes', 'No'] , category: 'social'},
      { label: 'Does the child hug a stuffed toy or show affection by hugging or cuddling?', type: 'radio', options: ['Yes', 'No'] , category: 'social'}
    ].map((field) => renderInputField({ field, onChange: onResponseChange }))}
  </div>
);

export const FifteenMonthsLanguage = ({ onResponseChange }: MilestoneProps) => (
  <div className="p-5 bg-white rounded-3xl shadow-md mb-8">
    <h3 className="text-lg font-semibold mb-4">Language/Communication Milestones</h3>
    {[
      { label: 'Does the child try to say one or two words besides "mama" or "dada" (e.g., "ba" for ball)?', type: 'radio', options: ['Yes', 'No'] ,category: 'language' },
      { label: 'Does the child look at a familiar object when you name it?', type: 'radio', options: ['Yes', 'No'] ,category: 'language' },
      { label: 'Can the child follow directions given with both a gesture and words, like giving you a toy when you say, "Give me the toy"?', type: 'radio', options: ['Yes', 'No'] ,category: 'language' }
    ].map((field) => renderInputField({ field, onChange: onResponseChange }))}
  </div>
);

export const FifteenMonthsCognitive = ({ onResponseChange }: MilestoneProps) => (
  <div className="p-5 bg-white rounded-3xl shadow-md mb-8">
    <h3 className="text-lg font-semibold mb-4">Cognitive Milestones</h3>
    {[
      { label: 'Does the child try to use things correctly, like a phone, cup, or book?', type: 'radio', options: ['Yes', 'No'] ,category: 'cognitive' },
      { label: 'Can the child stack at least two small objects, like blocks?', type: 'radio', options: ['Yes', 'No'] ,category: 'cognitive' }
    ].map((field) => renderInputField({ field, onChange: onResponseChange }))}
  </div>
);

export const FifteenMonthsMovement = ({ onResponseChange }: MilestoneProps) => (
  <div className="p-5 bg-white rounded-3xl shadow-md mb-8">
    <h3 className="text-lg font-semibold mb-4">Movement/Physical Development Milestones</h3>
    {[
      { label: 'Does the child take a few steps on their own?', type: 'radio', options: ['Yes', 'No'] ,category: 'movement' },
      { label: 'Does the child use their fingers to feed themselves some food?', type: 'radio', options: ['Yes', 'No'] ,category: 'movement' }
    ].map((field) => renderInputField({ field, onChange: onResponseChange }))}
  </div>
);

export const FifteenMonths = ({ onResponseChange }: MilestoneProps) => (
  <div id="fifteen-months">
    <h2 className="text-2xl font-bold mb-6">15 Months</h2>
    <FifteenMonthsSocial onResponseChange={onResponseChange} />
    <FifteenMonthsLanguage onResponseChange={onResponseChange} />
    <FifteenMonthsCognitive onResponseChange={onResponseChange} />
    <FifteenMonthsMovement onResponseChange={onResponseChange} />
  </div>
);

// **18 Months Components**
export const EighteenMonthsSocial = ({ onResponseChange }: MilestoneProps) => (
  <div className="p-5 bg-white rounded-3xl shadow-md mb-8">
    <h3 className="text-lg font-semibold mb-4">Social/Emotional Milestones</h3>
    {[
      { label: 'Does the child move away from you but look back to make sure you\'re nearby?', type: 'radio', options: ['Yes', 'No'] , category: 'social'},
      { label: 'Does the child point to show you something interesting?', type: 'radio', options: ['Yes', 'No'] , category: 'social'},
      { label: 'Does the child put hands out for you to wash them?', type: 'radio', options: ['Yes', 'No'] , category: 'social'},
      { label: 'Does the child look at a few pages in a book with you?', type: 'radio', options: ['Yes', 'No'] , category: 'social'},
      { label: 'Does the child help you dress them by pushing an arm through a sleeve or lifting a foot?', type: 'radio', options: ['Yes', 'No'] , category: 'social'}
    ].map((field) => renderInputField({ field, onChange: onResponseChange }))}
  </div>
);

export const EighteenMonthsLanguage = ({ onResponseChange }: MilestoneProps) => (
  <div className="p-5 bg-white rounded-3xl shadow-md mb-8">
    <h3 className="text-lg font-semibold mb-4">Language/Communication Milestones</h3>
    {[
      { label: 'Does the child try to say three or more words besides "mama" or "dada"?', type: 'radio', options: ['Yes', 'No'] ,category: 'language' },
      { label: 'Does the child follow one-step directions without gestures (e.g., giving you a toy when you say, "Give it to me")?', type: 'radio', options: ['Yes', 'No'] ,category: 'language' }
    ].map((field) => renderInputField({ field, onChange: onResponseChange }))}
  </div>
);

export const EighteenMonthsCognitive = ({ onResponseChange }: MilestoneProps) => (
  <div className="p-5 bg-white rounded-3xl shadow-md mb-8">
    <h3 className="text-lg font-semibold mb-4">Cognitive Milestones</h3>
    {[
      { label: 'Does the child imitate your actions, like sweeping with a broom?', type: 'radio', options: ['Yes', 'No'] ,category: 'cognitive' },
      { label: 'Does the child play with toys in a simple way, like pushing a toy car?', type: 'radio', options: ['Yes', 'No'] ,category: 'cognitive' }
    ].map((field) => renderInputField({ field, onChange: onResponseChange }))}
  </div>
);

export const EighteenMonthsMovement = ({ onResponseChange }: MilestoneProps) => (
  <div className="p-5 bg-white rounded-3xl shadow-md mb-8">
    <h3 className="text-lg font-semibold mb-4">Movement/Physical Development Milestones</h3>
    {[
      { label: 'Does the child walk without holding onto anyone or anything?', type: 'radio', options: ['Yes', 'No'] ,category: 'movement' },
      { label: 'Does the child scribble?', type: 'radio', options: ['Yes', 'No'] ,category: 'movement' },
      { label: 'Can the child drink from a cup without a lid, sometimes spilling?', type: 'radio', options: ['Yes', 'No'] ,category: 'movement' },
      { label: 'Can the child feed themselves with fingers?', type: 'radio', options: ['Yes', 'No'] ,category: 'movement' },
      { label: 'Does the child try to use a spoon?', type: 'radio', options: ['Yes', 'No'] ,category: 'movement' },
      { label: 'Can the child climb onto and off a couch or chair without help?', type: 'radio', options: ['Yes', 'No'] ,category: 'movement' }
    ].map((field) => renderInputField({ field, onChange: onResponseChange }))}
  </div>
);

export const EighteenMonths = ({ onResponseChange }: MilestoneProps) => (
  <div id="eighteen-months">
    <h2 className="text-2xl font-bold mb-6">18 Months</h2>
    <EighteenMonthsSocial onResponseChange={onResponseChange} />
    <EighteenMonthsLanguage onResponseChange={onResponseChange} />
    <EighteenMonthsCognitive onResponseChange={onResponseChange} />
    <EighteenMonthsMovement onResponseChange={onResponseChange} />
  </div>
);

// **24 Months Components**
export const TwentyFourMonthsSocial = ({ onResponseChange }: MilestoneProps) => (
  <div className="p-5 bg-white rounded-3xl shadow-md mb-8">
    <h3 className="text-lg font-semibold mb-4">Social/Emotional Milestones</h3>
    {[
      { label: 'Does the child notice when others are hurt or upset, like pausing or looking sad when someone is crying?', type: 'radio', options: ['Yes', 'No'] , category: 'social'},
      { label: 'Does the child look at your face to see how to react in a new situation?', type: 'radio', options: ['Yes', 'No'] , category: 'social'}
    ].map((field) => renderInputField({ field, onChange: onResponseChange }))}
  </div>
);

export const TwentyFourMonthsLanguage = ({ onResponseChange }: MilestoneProps) => (
  <div className="p-5 bg-white rounded-3xl shadow-md mb-8">
    <h3 className="text-lg font-semibold mb-4">Language/Communication Milestones</h3>
    {[
      { label: 'Does the child point to things in a book when you ask, like "Where is the bear?"', type: 'radio', options: ['Yes', 'No'] ,category: 'language' },
      { label: 'Can the child say at least two words together, such as "More milk"?', type: 'radio', options: ['Yes', 'No'] ,category: 'language' },
      { label: 'Can the child point to at least two body parts when you ask, like "Show me your nose"?', type: 'radio', options: ['Yes', 'No'] ,category: 'language' },
      { label: 'Does the child use gestures beyond waving and pointing, such as blowing a kiss or nodding yes?', type: 'radio', options: ['Yes', 'No'] ,category: 'language' }
    ].map((field) => renderInputField({ field, onChange: onResponseChange }))}
  </div>
);

export const TwentyFourMonthsCognitive = ({ onResponseChange }: MilestoneProps) => (
  <div className="p-5 bg-white rounded-3xl shadow-md mb-8">
    <h3 className="text-lg font-semibold mb-4">Cognitive Milestones</h3>
    {[
      { label: 'Can the child hold something in one hand while using the other hand (e.g., holding a container while taking the lid off)?', type: 'radio', options: ['Yes', 'No'] ,category: 'cognitive' },
      { label: 'Does the child try to use switches, knobs, or buttons on a toy?', type: 'radio', options: ['Yes', 'No'] ,category: 'cognitive' },
      { label: 'Does the child play with more than one toy at the same time, such as putting toy food on a toy plate?', type: 'radio', options: ['Yes', 'No'] ,category: 'cognitive' }
    ].map((field) => renderInputField({ field, onChange: onResponseChange }))}
  </div>
);

export const TwentyFourMonthsMovement = ({ onResponseChange }: MilestoneProps) => (
  <div className="p-5 bg-white rounded-3xl shadow-md mb-8">
    <h3 className="text-lg font-semibold mb-4">Movement/Physical Development Milestones</h3>
    {[
      { label: 'Can the child kick a ball?', type: 'radio', options: ['Yes', 'No'] ,category: 'movement' },
      { label: 'Can the child run?', type: 'radio', options: ['Yes', 'No'] ,category: 'movement' },
      { label: 'Does the child walk up a few stairs with or without help (without climbing)?', type: 'radio', options: ['Yes', 'No'] ,category: 'movement' },
      { label: 'Can the child eat with a spoon?', type: 'radio', options: ['Yes', 'No'] ,category: 'movement' }
    ].map((field) => renderInputField({ field, onChange: onResponseChange }))}
  </div>
);

export const TwentyFourMonths = ({ onResponseChange }: MilestoneProps) => (
  <div id="twenty-four-months">
    <h2 className="text-2xl font-bold mb-6">24 Months</h2>
    <TwentyFourMonthsSocial onResponseChange={onResponseChange} />
    <TwentyFourMonthsLanguage onResponseChange={onResponseChange} />
    <TwentyFourMonthsCognitive onResponseChange={onResponseChange} />
    <TwentyFourMonthsMovement onResponseChange={onResponseChange} />
  </div>
);

// **Above 2 Years Components**
export const AboveTwoYearsSocial = ({ onResponseChange }: MilestoneProps) => (
  <div className="p-5 bg-white rounded-3xl shadow-md mb-8">
    <h3 className="text-lg font-semibold mb-4">Social/Emotional Milestones</h3>
    {[
      { label: 'Does the child enjoy playing with other children?', type: 'radio', options: ['Yes', 'No'] , category: 'social'},
      { label: 'Does the child show empathy when others are hurt?', type: 'radio', options: ['Yes', 'No'] , category: 'social'}
    ].map((field) => renderInputField({ field, onChange: onResponseChange }))}
  </div>
);

export const AboveTwoYearsLanguage = ({ onResponseChange }: MilestoneProps) => (
  <div className="p-5 bg-white rounded-3xl shadow-md mb-8">
    <h3 className="text-lg font-semibold mb-4">Language/Communication Milestones</h3>
    {[
      { label: 'Can the child form simple sentences?', type: 'radio', options: ['Yes', 'No'] ,category: 'language' },
      { label: 'Does the child respond when called by name?', type: 'radio', options: ['Yes', 'No'] ,category: 'language' }
    ].map((field) => renderInputField({ field, onChange: onResponseChange }))}
  </div>
);

export const AboveTwoYearsCognitive = ({ onResponseChange }: MilestoneProps) => (
  <div className="p-5 bg-white rounded-3xl shadow-md mb-8">
    <h3 className="text-lg font-semibold mb-4">Cognitive Milestones</h3>
    {[
      { label: 'Can the child count objects?', type: 'radio', options: ['Yes', 'No'] ,category: 'cognitive' },
      { label: 'Does the child understand basic instructions?', type: 'radio', options: ['Yes', 'No'] ,category: 'cognitive' }
    ].map((field) => renderInputField({ field, onChange: onResponseChange }))}
  </div>
);

export const AboveTwoYearsMovement = ({ onResponseChange }: MilestoneProps) => (
  <div className="p-5 bg-white rounded-3xl shadow-md mb-8">
    <h3 className="text-lg font-semibold mb-4">Movement/Physical Development Milestones</h3>
    {[
      { label: 'Can the child run and jump easily?', type: 'radio', options: ['Yes', 'No'] ,category: 'movement' },
      { label: 'Does the child use both hands for activities?', type: 'radio', options: ['Yes', 'No'] ,category: 'movement' }
    ].map((field) => renderInputField({ field, onChange: onResponseChange }))}
  </div>
);

export const AboveTwoYears = ({ onResponseChange }: MilestoneProps) => (
  <div id="above-two-years">
    <h2 className="text-2xl font-bold mb-6">Above 2 Years</h2>
    <AboveTwoYearsSocial onResponseChange={onResponseChange} />
    <AboveTwoYearsLanguage onResponseChange={onResponseChange} />
    <AboveTwoYearsCognitive onResponseChange={onResponseChange} />
    <AboveTwoYearsMovement onResponseChange={onResponseChange} />
  </div>
);
