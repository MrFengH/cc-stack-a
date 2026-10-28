import asyncio
import edge_tts

async def list_es_female():
    voices = await edge_tts.list_voices()
    for v in voices:
        if v['Locale'].startswith('es-') and v['Gender'] == 'Female':
            name = v['ShortName']
            loc = v['Locale']
            desc = v.get('FriendlyName', '')
            print(f"{name:<32} | {loc} | {desc}")

if __name__ == '__main__':
    asyncio.run(list_es_female())
