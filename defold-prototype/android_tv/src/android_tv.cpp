#define LIB_NAME "BubbleSafariAndroidTV"

#include <dmsdk/sdk.h>

static dmExtension::Result AppInitializeBubbleSafariAndroidTV(dmExtension::AppParams* params)
{
    return dmExtension::RESULT_OK;
}

static dmExtension::Result AppFinalizeBubbleSafariAndroidTV(dmExtension::AppParams* params)
{
    return dmExtension::RESULT_OK;
}

static dmExtension::Result InitializeBubbleSafariAndroidTV(dmExtension::Params* params)
{
    return dmExtension::RESULT_OK;
}

static dmExtension::Result FinalizeBubbleSafariAndroidTV(dmExtension::Params* params)
{
    return dmExtension::RESULT_OK;
}

DM_DECLARE_EXTENSION(BubbleSafariAndroidTV, LIB_NAME,
    AppInitializeBubbleSafariAndroidTV,
    AppFinalizeBubbleSafariAndroidTV,
    InitializeBubbleSafariAndroidTV,
    0,
    0,
    FinalizeBubbleSafariAndroidTV)
