import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardContent className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert pt-6">
          <h1>Manifeste : HumanEdTech</h1>
          <h2>(Éducation, Technologie, Humanité)</h2>

          <h3>Préambule</h3>
          <p>
            Nous sommes à un carrefour historique. L'attention de nos enfants est capturée par des écrans conçus pour hypnotiser, 
            les savoirs se fragmentent en algorithmes, et l'érudition semble céder face à la dopamine des notifications. 
            Pourtant, rejeter la technologie serait une erreur fatale : elle est désormais le langage du monde. 
            Notre mission n'est pas de résister, mais de réinventer.
          </p>
          <p>
            HumanEdTech naît de cette conviction : la technologie doit servir l'humain, jamais l'asservir.
          </p>

          <h3>Le constat</h3>
          <ul>
            <li>
              <strong>L'urgence cognitive :</strong> Nos cerveaux, modelés par des interfaces addictives, 
              perdent leur capacité à approfondir, à nuancer, à imaginer.
            </li>
            <li>
              <strong>La fracture pédagogique :</strong> Les écoles peinent à rivaliser avec TikTok, 
              les enseignants à capter des regards déjà happés par d'infinis scrolls.
            </li>
            <li>
              <strong>Le piège du tout-ou-rien :</strong> Entre technophobie naïve et adoption servile, 
              un troisième chemin existe : dompter les outils pour libérer le potentiel humain.
            </li>
          </ul>

          <h3>Notre vision</h3>
          <p>Une pédagogie augmentée, jamais diminuée.</p>
          <p>
            Nous voulons des salles de classe où l'IA personnalise les apprentissages sans remplacer le regard bienveillant du professeur. 
            Des outils qui stimulent la curiosité plutôt que l'addiction, qui reconnectent les élèves à leur corps, 
            à leur intuition, à leur désir de créer.
          </p>
          <p>
            La technologie n'est pas une fin, mais un pont : vers des vocations révélées, des savoirs incarnés, une érudition joyeuse.
          </p>

          <h3>Nos principes</h3>
          <h4>La tech comme outil, jamais comme maître</h4>
          <ul>
            <li>Concevoir des algorithmes éthiques, transparents, qui respectent les rythmes biologiques et cognitifs.</li>
            <li>Bannir les designs prédateurs (autoplay, likes compulsifs) des espaces éducatifs.</li>
          </ul>

          <h4>L'humain d'abord</h4>
          <ul>
            <li>
              Cultiver l'intelligence sociale, l'esprit critique, la pensée paradoxale — des compétences 
              que les machines ne reproduiront pas avant des décennies.
            </li>
            <li>
              Réhabiliter les arts, la philosophie, le contact avec la nature comme antidotes à la virtualisation totale.
            </li>
          </ul>

          <h4>L'école laboratoire</h4>
          <ul>
            <li>Former les enseignants à co-créer avec la tech, non à la subir.</li>
            <li>
              Expérimenter (réalité virtuelle pour l'empathie historique, blockchain pour valoriser les apprentissages informels).
            </li>
          </ul>

          <h4>Éduquer à la liberté attentionnelle</h4>
          <ul>
            <li>
              Enseigner la « diététique numérique » : comment concentrer son attention comme on muscle un organe.
            </li>
            <li>
              Faire des élèves les architectes de leurs propres outils (coding éthique, hackathons pédagogiques).
            </li>
          </ul>

          <h3>Notre appel</h3>
          <p>
            À tous les enseignants fatigués de se sentir dépassés, aux développeurs rêvant de donner un sens à leur code, 
            aux parents inquiets mais lucides, rejoignez HumanEdTech.
          </p>
          <p>
            Ensemble, nous bâtirons des lieux où l'on apprend à la fois à coder et à méditer, à analyser des données 
            et à écrire des poèmes, à collaborer avec des IA sans oublier de regarder le ciel.
          </p>
          <p>
            Parce qu'éduquer, ce n'est pas formater des esprits pour un marché — c'est allumer des feux.
          </p>

          <blockquote>
            « La technologie a rétréci le monde, mais elle ne doit pas rétrécir notre humanité. »
            — HumanEdTech
          </blockquote>
        </CardContent>
      </Card>
    </div>
  );
}
