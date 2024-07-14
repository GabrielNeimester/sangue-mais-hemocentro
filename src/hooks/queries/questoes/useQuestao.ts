import { useEffect, useState } from "react";
import api from "../../../config/api";
import { Questao } from "../../../interfaces/questao";
import getToken from "../../../helpers/tokenUtil";

export function useQuestoes() {
  const [questao, setQuestao] = useState<Questao[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true)
    setIsError(false)

    api.get<Questao[]>('/questoes/showByUser', {
        headers: {
          Authorization: getToken()
        }
      })
      .then((response) => {
        setQuestao(response.data)
        console.log(questao)
        setIsLoading(false)
      })
      .catch((error) => {
        setIsLoading(false)
        setIsError(true)
        console.error('Error fetching hemocentro data:', error)
      })
  }, [])

  return { questao, isLoading, isError };
}


