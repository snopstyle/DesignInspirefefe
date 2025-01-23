
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black">
      <Card className="w-full max-w-4xl mx-auto my-8 bg-black/40 backdrop-blur-sm border border-white/10">
        <CardContent className="prose prose-lg dark:prose-invert max-w-3xl mx-auto p-8">
          <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-orange-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Pyro</h1>
          <h2 className="text-2xl font-semibold text-center mb-10 text-white/90">Éducation, Technologie, Humanité</h2>

          <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-orange-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Préambule</h3>
          <p className="text-gray-200 mb-6">
            Nous sommes à un carrefour historique. L'attention de nos enfants est capturée par des écrans conçus pour hypnotiser, 
            les savoirs se fragmentent en algorithmes, et l'érudition semble céder face à la dopamine des notifications. 
            Pourtant, rejeter la technologie serait une erreur fatale : elle est désormais le langage du monde. 
            Notre mission n'est pas de résister, mais de réinventer.
          </p>
          <p className="text-gray-200 mb-8">
            HumanEdTech naît de cette conviction : la technologie doit servir l'humain, jamais l'asservir.
          </p>

          <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-orange-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Le constat</h3>
          <ul className="space-y-4 text-gray-200 mb-8">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <div>
                <strong className="text-white">L'urgence cognitive :</strong> Nos cerveaux, modelés par des interfaces addictives, 
                perdent leur capacité à approfondir, à nuancer, à imaginer.
              </div>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <div>
                <strong className="text-white">La fracture pédagogique :</strong> Les écoles peinent à rivaliser avec TikTok, 
                les enseignants à capter des regards déjà happés par d'infinis scrolls.
              </div>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <div>
                <strong className="text-white">Le piège du tout-ou-rien :</strong> Entre technophobie naïve et adoption servile, 
                un troisième chemin existe : dompter les outils pour libérer le potentiel humain.
              </div>
            </li>
          </ul>

          <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-orange-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Notre vision</h3>
          <p className="text-gray-200 font-semibold mb-4">Une pédagogie augmentée, jamais diminuée.</p>
          <p className="text-gray-200 mb-6">
            Nous voulons des salles de classe où l'IA personnalise les apprentissages sans remplacer le regard bienveillant du professeur. 
            Des outils qui stimulent la curiosité plutôt que l'addiction, qui reconnectent les élèves à leur corps, 
            à leur intuition, à leur désir de créer.
          </p>
          <p className="text-gray-200 mb-8">
            La technologie n'est pas une fin, mais un pont : vers des vocations révélées, des savoirs incarnés, une érudition joyeuse.
          </p>

          <blockquote className="border-l-4 border-purple-500 pl-6 my-8 text-xl italic text-white/90">
            « La technologie a rétréci le monde, mais elle ne doit pas rétrécir notre humanité. »
            <footer className="text-right text-gray-400 mt-2">— HumanEdTech</footer>
          </blockquote>
        </CardContent>
      </Card>
    </div>
  );
}
