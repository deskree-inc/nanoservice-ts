from abc import ABC
from typing import List

class LoggerContext(ABC):
    def log(self, message: str) -> None:
        pass

    def getLogs(self) -> List[str]:
        pass

    def getLogsAsText(self) -> str:
        pass

    def getLogsAsBase64(self) -> str:
        pass

    def logLevel(self, level: str, message: str) -> None:
        pass

    def error(self, message: str, stack: str) -> None:
        pass