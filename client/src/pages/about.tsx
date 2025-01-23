
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black">
      <Card className="w-full max-w-4xl mx-auto my-8 bg-black/40 backdrop-blur-sm border border-white/10">
        <CardContent className="prose prose-lg dark:prose-invert max-w-3xl mx-auto p-8">
          <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-orange-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Manifeste : HumanEdTech</h1>
          <h2 className="text-2xl font-semibold text-center mb-10 text-white/90">(Éducation, Technologie, Humanité)</h2>

          <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-orange-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Préambule</h3>
          <p className="text-gray-200 mb-6 text-justify">
            Nous sommes à un carrefour historique. L'attention de nos enfants est capturée par des écrans conçus pour hypnotiser, 
            les savoirs se fragmentent en algorithmes, et l'érudition semble céder face à la dopamine des notifications. 
            Pourtant, rejeter la technologie serait une erreur fatale : elle est désormais le langage du monde. 
            Notre mission n'est pas de résister, mais de réinventer.
          </p>
          <p className="text-gray-200 mb-8 text-justify">
            HumanEdTech naît de cette conviction : la technologie doit servir l'humain, jamais l'asservir.
          </p>

          <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-orange-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Le constat</h3>
          <ul className="space-y-4 text-gray-200 mb-8">
            <li className="flex items-start text-justify">
              <span className="mr-2">•</span>
              <div>
                <strong className="text-white">L'urgence cognitive :</strong> Nos cerveaux, modelés par des interfaces addictives, 
                perdent leur capacité à approfondir, à nuancer, à imaginer.
              </div>
            </li>
            <li className="flex items-start text-justify">
              <span className="mr-2">•</span>
              <div>
                <strong className="text-white">La fracture pédagogique :</strong> Les écoles peinent à rivaliser avec TikTok, 
                les enseignants à capter des regards déjà happés par d'infinis scrolls.
              </div>
            </li>
            <li className="flex items-start text-justify">
              <span className="mr-2">•</span>
              <div>
                <strong className="text-white">Le piège du tout-ou-rien :</strong> Entre technophobie naïve et adoption servile, 
                un troisième chemin existe : dompter les outils pour libérer le potentiel humain.
              </div>
            </li>
          </ul>

          <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-orange-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Notre vision</h3>
          <p className="text-gray-200 font-semibold mb-4">Une pédagogie augmentée, jamais diminuée.</p>
          <p className="text-gray-200 mb-6 text-justify">
            Nous voulons des salles de classe où l'IA personnalise les apprentissages sans remplacer le regard bienveillant du professeur. 
            Des outils qui stimulent la curiosité plutôt que l'addiction, qui reconnectent les élèves à leur corps, 
            à leur intuition, à leur désir de créer.
          </p>
          <p className="text-gray-200 mb-8 text-justify">
            La technologie n'est pas une fin, mais un pont : vers des vocations révélées, des savoirs incarnés, une érudition joyeuse.
          </p>

          <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-orange-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Nos principes</h3>
          <div className="space-y-6 mb-8">
            <div>
              <h4 className="text-xl font-semibold mb-2 text-white">1. La tech comme outil, jamais comme maître</h4>
              <ul className="list-disc pl-6 text-gray-200 space-y-2">
                <li className="text-justify">Concevoir des algorithmes éthiques, transparents, qui respectent les rythmes biologiques et cognitifs.</li>
                <li className="text-justify">Bannir les designs prédateurs (autoplay, likes compulsifs) des espaces éducatifs.</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-2 text-white">2. L'humain d'abord</h4>
              <ul className="list-disc pl-6 text-gray-200 space-y-2">
                <li className="text-justify">Cultiver l'intelligence sociale, l'esprit critique, la pensée paradoxale — des compétences que les machines ne reproduiront pas avant des décennies.</li>
                <li className="text-justify">Réhabiliter les arts, la philosophie, le contact avec la nature comme antidotes à la virtualisation totale.</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-2 text-white">3. L'école laboratoire</h4>
              <ul className="list-disc pl-6 text-gray-200 space-y-2">
                <li className="text-justify">Former les enseignants à co-créer avec la tech, non à la subir.</li>
                <li className="text-justify">Expérimenter (réalité virtuelle pour l'empathie historique, blockchain pour valoriser les apprentissages informels).</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-2 text-white">4. Éduquer à la liberté attentionnelle</h4>
              <ul className="list-disc pl-6 text-gray-200 space-y-2">
                <li className="text-justify">Enseigner la « diététique numérique » : comment concentrer son attention comme on muscle un organe.</li>
                <li className="text-justify">Faire des élèves les architectes de leurs propres outils (coding éthique, hackathons pédagogiques).</li>
              </ul>
            </div>
          </div>

          <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-orange-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Notre appel</h3>
          <p className="text-gray-200 mb-6 text-justify">
            À tous les enseignants fatigués de se sentir dépassés, aux développeurs rêvant de donner un sens à leur code, 
            aux parents inquiets mais lucides, rejoignez <strong>HumanEdTech</strong>.
          </p>
          <p className="text-gray-200 mb-8 text-justify">
            Ensemble, nous bâtirons des lieux où l'on apprend à la fois à coder et à méditer, à analyser des données et à écrire des poèmes, 
            à collaborer avec des IA sans oublier de regarder le ciel.
          </p>

          <p className="text-gray-200 mb-8 text-justify italic">
            Parce qu'éduquer, ce n'est pas formater des esprits pour un marché — c'est allumer des feux.
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
