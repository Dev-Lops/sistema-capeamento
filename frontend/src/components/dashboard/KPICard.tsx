import type {
  ReactNode
} from "react";


type Props = {

  title: string;

  value: number;

  icon: ReactNode;

  subtitle: string;

  glow: string;
};


function KPICard({
  title,
  value,
  icon,
  subtitle,
  glow,
}: Props) {

  return (

    <div
      className={`
        relative
        overflow-hidden
        rounded-2xl
        border
        border-white/10
        bg-white/5
        backdrop-blur-xl
        p-6
        shadow-2xl
        transition-all
        duration-300
        hover:scale-[1.02]
        ${glow}
      `}
    >

      {/* GLOW */}

      <div
        className="
          absolute
          top-0
          right-0
          w-32
          h-32
          bg-white/10
          rounded-full
          blur-3xl
        "
      />


      {/* CONTEÚDO */}

      <div className="relative z-10">

        <div
          className="
            flex
            items-center
            justify-between
            mb-6
          "
        >

          <div>

            <p
              className="
                text-sm
                text-gray-400
              "
            >
              {title}
            </p>

            <h2
              className="
                text-4xl
                font-bold
                text-white
                mt-2
              "
            >
              {value}
            </h2>

          </div>


          <div
            className="
              w-14
              h-14
              rounded-xl
              bg-white/10
              flex
              items-center
              justify-center
              text-white
            "
          >
            {icon}
          </div>

        </div>


        <p
          className="
            text-sm
            text-gray-400
          "
        >
          {subtitle}
        </p>

      </div>

    </div>
  );
}

export default KPICard;