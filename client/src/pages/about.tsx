import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black">
      <Card className="w-full max-w-4xl mx-4 bg-black/40 backdrop-blur-sm border-white/10">
        <CardContent className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert pt-6 text-justify">
          <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-gradient-to-r from-orange-500 via-purple-500 to-pink-500 bg-clip-text">Manifeste : HumanEdTech</h1>
          <h2 className="text-2xl font-semibold text-center mb-6 text-white/80">(Éducation, Technologie, Humanité)</h2>

          <h3 className="text-xl font-semibold mt-8 text-white">Préambule</h3>
          <p className="text-gray-300">
            Nous sommes à un carrefour historique. L'attention de nos enfants est capturée par des écrans conçus pour hypnotiser, 
            les savoirs se fragmentent en algorithmes, et l'érudition semble céder face à la dopamine des notifications. 
            Pourtant, rejeter la technologie serait une erreur fatale : elle est désormais le langage du monde. 
            Notre mission n'est pas de résister, mais de réinventer.
          </p>
          <p className="text-gray-300">
            HumanEdTech naît de cette conviction : la technologie doit servir l'humain, jamais l'asservir.
          </p>

          <h3 className="text-xl font-semibold mt-8 text-white">Le constat</h3>
          <ul className="text-gray-300">
            <li>
              <strong className="text-white/90">L'urgence cognitive :</strong> Nos cerveaux, modelés par des interfaces addictives, 
              perdent leur capacité à approfondir, à nuancer, à imaginer.
            </li>
            <li>
              <strong className="text-white/90">La fracture pédagogique :</strong> Les écoles peinent à rivaliser avec TikTok, 
              les enseignants à capter des regards déjà happés par d'infinis scrolls.
            </li>
            <li>
              <strong className="text-white/90">Le piège du tout-ou-rien :</strong> Entre technophobie naïve et adoption servile, 
              un troisième chemin existe : dompter les outils pour libérer le potentiel humain.
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-8 text-white">Notre vision</h3>
          <p className="text-gray-300">Une pédagogie augmentée, jamais diminuée.</p>
          <p className="text-gray-300">
            Nous voulons des salles de classe où l'IA personnalise les apprentissages sans remplacer le regard bienveillant du professeur. 
            Des outils qui stimulent la curiosité plutôt que l'addiction, qui reconnectent les élèves à leur corps, 
            à leur intuition, à leur désir de créer.
          </p>
          <p className="text-gray-300">
            La technologie n'est pas une fin, mais un pont : vers des vocations révélées, des savoirs incarnés, une érudition joyeuse.
          </p>

          <blockquote className="my-8 text-lg font-medium italic border-l-4 border-purple-500/60 pl-4 text-gray-300">
            « La technologie a rétréci le monde, mais elle ne doit pas rétrécir notre humanité. »
            <footer className="text-right text-gray-400">— HumanEdTech</footer>
          </blockquote>
        </CardContent>
      </Card>
    </div>
  );
}